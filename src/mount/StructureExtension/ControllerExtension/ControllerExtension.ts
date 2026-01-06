import { LEVEL_BUILD_RAMPART, UPGRADER_WITH_ENERGY_LEVEL_8 } from "@/setting";
import { getRoomStats, setRoomStats } from "@/modules/stats";
import { countEnergyChangeRatio } from "@/modules/energyController";
import { delayQueue } from "@/modules/delayQueue";
import { whiteListFilter } from "@/utils/global/whiteListFilter";

/**
 * Controller 拓展
 * 统计当前升级进度、移除无效的禁止通行点位
 */
export default class ControllerExtension extends StructureController {
  public onWork(): void {
    // 解除这两行的注释以显示队列信息
    this.room.work.draw(1, 3);
    this.room.transport.draw(1, 13);

    this.drawEnergyHarvestInfo();
    this.drawUpdateInfo()
    if (Game.time % 20) return;
    // 如果等级发生变化了就运行 creep 规划
    if (this.stateScanner()) this.onLevelChange(this.level);

    // 调整运营 creep 数量
    this.adjustCreep();

    // 检查外矿有没有被入侵的，有的话是不是可以重新发布 creep
    if (this.room.memory.remote) {
      for (const remoteRoomName in this.room.memory.remote) {
        // 如果发现入侵者已经老死了，就移除对应属性并重新发布外矿角色组
        if (this.room.memory.remote[remoteRoomName].disableTill <= Game.time) {
          delete this.room.memory.remote[remoteRoomName].disableTill;
          this.room.spawner.release.remoteCreepGroup(remoteRoomName);
        }
      }
    }
  }

  private drawUpdateInfo(): void {
    const roomStats = getRoomStats(this.room.name);
    if (!roomStats || !roomStats.controllerRatio || !roomStats.remainingUpateTime) return;
    const { controllerRatio, remainingUpateTime } = roomStats;
    const { x, y } = this.pos;
    this.room.visual.text(
      `升级进度 ${controllerRatio ? controllerRatio.toFixed(2) : 0} %`,
      x - 1 - 0.5,
      y + 0.25 + 2,
      {
        align: "left",
        opacity: 0.5
      }
    );
    this.room.visual.text(
      `剩余升级所需时间 ${remainingUpateTime ? this.formatSecondsToDHMS(remainingUpateTime, 2) : 0}`,
      x - 1 - 0.5,
      y + 0.25 + 3,
      {
        align: "left",
        opacity: 0.5
      }
    );
  }

  /**
   * 临时 - 显示能量获取速率
   */
  private drawEnergyHarvestInfo() {
    const roomStats = getRoomStats(this.room.name);
    if (!roomStats || !roomStats.totalEnergy || !roomStats.energyGetRate) return;
    const { totalEnergy, energyGetRate } = roomStats;
    const { x, y } = this.pos;
    this.room.visual.text(
      `可用能量 ${totalEnergy || 0}`,
      x + 1,
      y + 0.25,
      {
        align: "left",
        opacity: 0.5
      }
    );
    this.room.visual.text(
      `获取速率 ${energyGetRate ? energyGetRate.toFixed(2) : 0}`,
      x + 1,
      y + 0.25 + 1,
      {
        align: "left",
        opacity: 0.5
      }
    );
  }

  /**
   * 当等级发生变化时的回调函数
   *
   * @param level 当前的等级
   */
  public onLevelChange(level: number): void {
    // 刚占领，添加工作单位
    if (level === 1) {
      this.room.spawner.release.harvester();
      this.room.spawner.release.changeBaseUnit("manager", 1);
      this.room.spawner.release.changeBaseUnit("worker", 2);
    } else if (level === LEVEL_BUILD_RAMPART[0] || level === 4) {
      // 开始刷墙后就开始执行刷墙任务
      this.room.work.updateTask({ type: "fillWall", priority: 0 });
    } else if (level === 8) {
      this.decideUpgradeWhenRCL8();
    }

    // 规划布局
    if (level !== 1) this.log(this.room.planLayout(), "green");
  }

  /**
   * 房间升到 8 级后的升级计划
   */
  private decideUpgradeWhenRCL8(): void {
    // 满足以下条件就暂停升级
    if (
      Game.cpu.bucket < 700 ||
      !this.room.storage ||
      this.room.storage.store[RESOURCE_ENERGY] < UPGRADER_WITH_ENERGY_LEVEL_8
    ) {
      // 暂时停止升级计划
      this.room.work.removeTask("upgrade");
      delayQueue.addDelayTask("spawnUpgrader", { roomName: this.room.name }, 10000);
    } else {
      // 限制只需要一个单位升级
      this.room.work.updateTask({ type: "upgrade", need: 1, priority: 5 });
    }
  }

  /**
   * 将总秒数转换为 天:时:分:秒（d:h:m:s）格式，自动补零为两位数
   * @param {number} totalSeconds - 总秒数（非负整数）
   * @returns {string} 格式化后的时间字符串（如 02:01:02:03）
   */
  private formatSecondsToDHMS(origianlTotalseconds: number, decimalDigits: number = 2): string {

    // 1. 计算天数：1天=86400秒（24*3600），向下取整
    const totalSeconds = Number(origianlTotalseconds.toFixed(decimalDigits))
    const days = Math.floor(totalSeconds / 86400);
    // 2. 计算剩余秒数（扣除天数后）
    const remainingSecondsAfterDays = totalSeconds % 86400;
    // 3. 复用基础版的逻辑计算时分秒
    const hours = Math.floor(remainingSecondsAfterDays / 3600);
    const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);

    const seconds = remainingSecondsAfterHours % 60;

    const multiplier = Math.pow(10, decimalDigits);
    const truncatedNum = Math.floor(seconds * multiplier) / multiplier;

    // 4. 补零函数
    const padZero = (num) => num.toString().padStart(2, '0');

    // 5. 拼接并返回格式化字符串
    return `${padZero(days)} days : ${padZero(hours)} hours : ${padZero(minutes)} minutes : ${padZero(truncatedNum)} seconds`;
  }
  /**
   * 统计自己的等级信息
   *
   * @returns 为 true 时说明自己等级发生了变化
   */
  public stateScanner(): boolean {
    let hasLevelChange = false;
    setRoomStats(this.room.name, stats => {
      hasLevelChange = stats.controllerLevel !== this.level;
      const deltaTime = Game.time - stats.energyCalcTime;
      const progressRemaining = this.progressTotal - this.progress
      const deltaProgress = this.progress - stats.progress
      return {
        // 统计升级进度
        controllerRatio: (this.progress / this.progressTotal) * 100,
        // 统计房间等级
        controllerLevel: this.level,
        // 统计剩余更新所需时间
        remainingUpateTime: ( progressRemaining / deltaProgress) * deltaTime,

        progress: this.progress
      };
    });

    // 统计本房间能量状态
    countEnergyChangeRatio(this.room);
    this.structureScanner();

    return hasLevelChange;
  }

  /**
   * 检查敌人威胁
   * 检查房间内所有敌人的身体部件情况确认是否可以造成威胁
   *
   * @returns 是否可以造成威胁（是否启用主动防御模式）
   */
  public checkEnemyThreat(): boolean {
    // 这里并没有搜索 PC，因为 PC 不是敌人主力
    const enemy =
      this.room.enemys ||
      this.room.find(FIND_HOSTILE_CREEPS, {
        filter: whiteListFilter
      });
    if (enemy && enemy.length <= 0) return false;

    // 如果来的都是入侵者的话，就算撑破天了也不管
    if (!enemy.find(creep => creep.owner.username !== "Invader")) return false;

    const bodyNum = enemy
      .map(creep => {
        // 如果是 creep 则返回身体部件，如果不是则不参与验证
        return creep instanceof Creep ? creep.body.length : 0;
      })
      .reduce((pre, cur) => pre + cur);
    // 满配 creep 数量大于 1，就启动主动防御
    return bodyNum > MAX_CREEP_SIZE;
  }

  /**
   * 扫描房间内建筑
   */
  public structureScanner(): void {
    const structures = this.room.find(FIND_STRUCTURES);
    const structureNums: { [structureName: string]: number } = {};

    if (structures.length > 0) {
      Object.values(structures).forEach(structure => {
        if (!Object.keys(structureNums).includes(structure.structureType)) {
          structureNums[structure.structureType] = 1;
        } else {
          structureNums[structure.structureType] += 1;
        }
      });
    }
    Memory.stats.rooms[this.room.name].structureNums = structureNums;
  }

  /**
   * 根据房间情况调整运营单位的数量
   */
  private adjustCreep(): void {
    this.room.spawner.release.changeBaseUnit("manager", this.room.transport.getExpect());
    // 先更新房间能量使用情况，然后根据情况调整期望
    const energyGetRate = countEnergyChangeRatio(this.room, true);
    const workerChange = this.room.work.getExpect(energyGetRate);

    this.room.spawner.release.changeBaseUnit("worker", workerChange);
  }
  /**
   * 重新占领，刷 RCL 用
   */
  private reClaim(): void {
    this.room.spawner.addTask({
      name: `${this.room.name} reClaimer`,
      role: "reClaimer",
      data: { targetRoomName: this.room.name }
    });
  }

  private upgradePosInfosFiltered = false;

  private getUpgradePosInfos(): Record<string, UpgradePosInfo> {
    if (!this.room.memory.upgradePosInfos) {
      this.room.memory.upgradePosInfos = {};
      this.pos.getCanStandPos(3).forEach(pos => {
        this.room.memory.upgradePosInfos[`${pos.x},${pos.y}`] = {
          x: pos.x,
          y: pos.y,
          creepId: undefined,
          rangeToController: pos.getRangeTo(this.room.controller) || undefined,
          rangeToStorage: pos.getRangeTo(this.room.storage) || undefined,
          rangeToTerminal: pos.getRangeTo(this.room.terminal) || undefined
        };
      });
    }
    if (!this.upgradePosInfosFiltered) {
      _.forEach(this.room.memory.upgradePosInfos, info => {
        if (!Game.getObjectById(info.creepId))
          this.room.memory.upgradePosInfos[`${info.x},${info.y}`].creepId = undefined;
      });
      this.upgradePosInfosFiltered = true;
    }
    return this.room.memory.upgradePosInfos;
  }

  public getUpgradePos(creep: Creep): RoomPosition {
    let info: UpgradePosInfo;

    const upgradePosInfos = this.getUpgradePosInfos();
    const unusedPosInfo = _.filter(upgradePosInfos, item => !item.creepId);

    info = _.find(upgradePosInfos, item => item.creepId === creep.id);
    for (const range of [1, 2, 3, 4, 5, 6, 7]) {
      if (info) break;
      if (!info) info = _.find(unusedPosInfo, item => item.rangeToStorage === range || item.rangeToTerminal === range);
    }
    if (!info) info = _.find(unusedPosInfo, item => item);
    if (creep.memory.role === "gclUpgrader")
      if ("upgradePosInfo" in (creep as Creep<"gclUpgrader">).memory.data) {
        (creep as Creep<"gclUpgrader">).memory.data.upgradePosInfo = info;
      }

    this.room.memory.upgradePosInfos[`${info.x},${info.y}`].creepId = creep.id;
    return new RoomPosition(info.x, info.y, this.room.name);
  }
}

/**
 * 注册升级工的延迟孵化任务
 */
delayQueue.addDelayCallback("spawnUpgrader", room => {
  // 房间或终端没了就不在孵化
  if (!room || !room.storage) return;

  // 满足以下条件时就延迟发布
  if (
    // cpu 不够
    Game.cpu.bucket < 700 ||
    // 能量不足
    room.storage.store[RESOURCE_ENERGY] < UPGRADER_WITH_ENERGY_LEVEL_8 ||
    room.controller.ticksToDowngrade < 100000
  )
    return delayQueue.addDelayTask("spawnUpgrader", { roomName: room.name }, 10000);

  room.work.updateTask({ type: "upgrade", need: 1, priority: 5 });
});
