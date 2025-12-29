import RoomSpawnController from "@/modules/room/spawn";
import { createHelp } from "@/modules/help";
import { WayPoint } from "@/modules/move";
import { DEFAULT_FLAG_NAME } from "@/setting/OtherSetting"
/**
 * TODO 添加兵工厂配置
 */
export default class RoomArsenelController extends RoomSpawnController {

  /**
   * 实例化房间孵化管理
   * @param roomName 要管理的房间名
   */
  constructor(rootName: string) {
    super(rootName)
  }
  /**
   * 孵化基础进攻单位
   *
   */
  public attacker(targetFlagName = "", num = 1, keepSpawn = false, wayPoint?: WayPoint): string {
    return this.release.attacker(targetFlagName, num, keepSpawn, wayPoint);
  }
  /**
   * 孵化进攻一体机
   */
  public rangedAttacker(
    targetFlagName: string = DEFAULT_FLAG_NAME.ATTACK,
    num = 1,
    keepSpawn = false,
    wayPoint?: WayPoint
  ): string {
    return this.release.rangedAttacker(targetFlagName, num, keepSpawn, wayPoint)
  }

  public boostRangedAttacker(
    bearTowerNum: 0 | 1 | 3 | 5 | 2 | 4 | 6 = 6,
    targetFlagName: string = DEFAULT_FLAG_NAME.ATTACK,
    keepSpawn = false
  ): string {
    return this.release.boostRangedAttacker(bearTowerNum, targetFlagName, keepSpawn)
  }

  public dismantler(targetFlagName = "", num = 2, keepSpawn = false, wayPoint?: WayPoint): string {
    return this.release.dismantler(targetFlagName, num, keepSpawn, wayPoint)
  }

  public reiver(sourceFlagName = "", targetStructureId: Id<StructureWithStore> = undefined): string {
    return this.release.reiver(sourceFlagName, targetStructureId)
  }

  public scout(targetFlagName = "", num = 1, keepSpawn = false, wayPoint?: WayPoint): string {
    return this.release.scout(targetFlagName, num, keepSpawn, wayPoint)
  }

  public help(): string {
    return createHelp({
      name: "房间兵工厂管理",
      describe: "管理不同类型战斗creep的孵化",
      api: [
        {
          title: "孵化基础战斗creep",
          params: [
            { name: "targetFlagName", desc: "进攻旗帜名称" },
            { name: "num", desc: "要孵化的数量，默认数量为 1" },
            { name: "keepSpawn", desc: "是否持续生成" },
            { name: "wayPoint", desc: "【可选】路径点" },
          ],
          functionName: "attacker"
        },
        {
          title: "孵化远程战斗creep组",
          describe: "孵化进攻一体机",
          params: [
            { name: "targetFlagName", desc: "进攻旗帜名称" },
            { name: "num", desc: "要孵化的数量，默认数量为 1" },
            { name: "keepSpawn", desc: "是否持续生成" },
            { name: "wayPoint", desc: "【可选】路径点" },
          ],
          functionName: "rangedAttacker"
        },
        {
          title: "孵化强化远程战斗creep组",
          params: [
            { name: "bearTowerNum", desc: "抗塔等级 0-6，等级越高扛伤能力越强，伤害越低" },
            { name: "targetFlagName", desc: "进攻旗帜名称" },
            { name: "keepSpawn", desc: "是否持续生成" },
          ],
          functionName: "boostRangedAttacker"
        },
        {
          title: "孵化基础拆除creep",
          describe: "孵化基础拆除单位，一般用于清除中立房间中挡路的墙壁",
          params: [
            { name: "targetFlagName", desc: "进攻旗帜名称" },
            { name: "num", desc: "要孵化的数量，默认数量为 2" },
            { name: "keepSpawn", desc: "是否持续生成，默认为false" },
            { name: "wayPoint", desc: "【可选】路径点" },
          ],
          functionName: "dismantler"
        },
        {
          title: "孵化基础拆除单位",
          describe: "孵化基础拆除单位，一般用于清除中立房间中挡路的墙壁",
          params: [
            { name: "sourceFlagName", desc: "要搜刮的建筑上插好的旗帜名" },
            { name: "targetStructureId", desc: "要把资源存放到的建筑 id" },
          ],
          functionName: "reiver"
        },
        {
          title: "孵化 boost 拆墙小组",
          describe: "孵化 boost 拆墙小组",
          params: [
            { name: "targetFlagName", desc: "进攻旗帜名称" },
            { name: "keepSpawn", desc: "是否持续生成，默认为false" },
            { name: "wayPoint", desc: "【可选】路径点" },
          ],
          functionName: "dismantleGroup"
        },
        {
          title: "孵化斥候单位",
          describe: "侦察creep",
          params: [
            { name: "targetFlagName", desc: "进攻旗帜名称" },
            { name: "num", desc: "要孵化的数量" },
            { name: "keepSpawn", desc: "是否持续生成" },
            { name: "wayPoint", desc: "路径点" },
          ],
          functionName: "scout"
        }
      ]
    });
  }
}
