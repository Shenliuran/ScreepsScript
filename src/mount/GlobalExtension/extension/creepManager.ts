import { createHelp } from "@/modules/help";
import { hasCreep, removeCreep, showCreep } from "@/modules/creep/utils";

/**
 * 全局creep管理模块
 * 配置全局creep的配置显示、creep查找、以及按照模糊查找的模式删除（批量删除）匹配到creep
 */
export default {
  /**
   * 格式化输出所有 creep 配置
   */
  show(): string {
    return showCreep()
  },

  /**
   * 是否存在指定 creep
   *
   * @param creepName 要检查是否存在的 creep 名称
   */
  has(creepName: string): boolean {
    return hasCreep(creepName)
  },

  /**
   * 移除指定 creep
   * 会移除名字中包含第一个参数的 creep
   *
   * @param creepNamePart 要移除的 creep 名称部分
   * @param batch 【可选】是否批量移除，默认只会移除匹配到的第一个 creep
   * @param immediate 【可选】是否立刻移除，默认会在 creep 自然老死后移除
   */
  remove(creepNamePart: string, batch: boolean = false, immediate: boolean = false): string {
    removeCreep(creepNamePart, {batch:batch, immediate:immediate})
    if (!batch) {
      if (immediate) {
        return `名字包含中 ${creepNamePart} 的第一个creep已被移除!`;
      } else {
        return `名字包含中 ${creepNamePart} 的第一个creep将在自然死亡后被移除!`;
      }
    } else {
      if (immediate) {
        return `名字包含中 ${creepNamePart} 的所有creep已被移除!`;
      } else {
        return `名字包含中 ${creepNamePart} 的所有creep将在自然死亡后被移除!`;
      }
    }
  },

  /**
   * 帮助信息
   */
  help(): string {
    return createHelp({
      name: "全局creep管理模块",
      describe: "显示、搜索和移除creep",
      api: [
        {
          title: "移除指定 creep",
          params: [
            { name: "creepNamePart", desc: "要移除的 creep 名称部分" },
            { name: "batch", desc: "【可选】是否批量移除，默认只会移除匹配到的第一个 creep" },
            { name: "immediate", desc: "【可选】是否立刻移除，默认会在 creep 自然老死后移除" },
          ],
          functionName: "remove"
        },
        {
          title: "是否存在指定 creep",
          params: [{ name: "creepName", desc: "creepName 要检查是否存在的 creep 名称" }],
          functionName: "has"
        },
        {
          title: "格式化输出所有 creep 配置",
          functionName: "show"
        }
      ]
    });
  }
};

declare global {
  interface Memory {
    /**
     * 要绕过的房间名列表，由全局模块 bypass 负责
     */
    creep: string[];
  }
}
