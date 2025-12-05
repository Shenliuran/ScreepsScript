# ScreepsScript 项目完整文档

## 项目概述

ScreepsScript 是一个基于TypeScript的Screeps游戏AI框架，采用模块化设计，通过插件式架构管理各种游戏功能。

## 项目整体架构

这是一个基于TypeScript的Screeps游戏AI框架，采用模块化设计，通过插件式架构管理各种游戏功能。

## 详细文件结构分析

### 项目根目录文件

1. **package.json** - 项目依赖和脚本配置
2. **tsconfig.json** - TypeScript编译配置
3. **rollup.config.ts** - 打包配置
4. **screeps.sample.json** - Screeps服务器配置模板
5. **.eslintrc.yml** - 代码规范配置
6. **.prettierrc** - 代码格式化配置
7. **jest.config.ts** - 测试框架配置

### src/main.ts - 项目入口

```typescript
import App from "./modules/framework"
// ... 导入所有模块

const app = new App()
// 注册所有模块
app.register(Modules)
// 启动应用
export = app.loop
```

### src/modules/ - 核心功能模块

#### 1. framework/ - 框架系统
- **index.ts**: 框架主类，管理所有模块的生命周期
- **types.d.ts**: 定义模块接口(IModule)和生命周期类型

框架实现的生命周期:
- `born()`: 仅在初次放置spawn时执行
- `reset()`: 全局重置
- `tickStart()`: 每tick开始
- `onWork()`: 每tick主要工作
- `afterWork()`: 所有onWork后执行
- `tickEnd()`: 每tick结束

#### 2. autoPlanning/ - 自动规划模块
- **index.ts**: 规划主逻辑
- **planBase.ts**: 基地规划
- **planBasePos.ts**: 基地位置规划
- **planRoad.ts**: 道路规划
- **planWall.ts**: 墙壁规划
- **types.d.ts**: 规划相关类型定义

#### 3. ConstructionController/ - 建筑控制器
- **index.ts**: 监控ConstructionSite的完成事件
- **types.d.ts**: 建筑相关类型

#### 4. creep/ - Creep管理模块
- **index.ts**: Creep模块主逻辑
- **creepHandle.ts**: Creep处理函数
- **creepNumberListener.ts**: 监听Creep数量变化
- **utils.ts**: Creep相关工具函数

#### 5. crossShard/ - 跨shard通信
- **index.ts**: 跨shard通信主逻辑
- **handleStrategies.ts**: 通信策略处理
- **types.d.ts**: 跨shard通信类型定义

#### 6. delayQueue/ - 延迟队列
- **index.ts**: 延迟执行队列管理
- **types.d.ts**: 队列相关类型

#### 7. energyController/ - 能量管理
- **index.ts**: 房间能量管理主逻辑
- **countEnergyChangeRatio.ts**: 计算能量变化比率
- **findStrategy.ts**: 寻找能量策略
- **getRoomEnergyTarget.ts**: 获取房间能量目标
- **types.d.ts**: 能量管理相关类型

#### 8. mapLibrary/ - 地图库
- **index.ts**: 地图库主逻辑
- **compression.ts**: 地图数据压缩
- **controller.ts**: 地图控制器
- **library.ts**: 地图数据存储
- **types.ts**: 地图相关类型

#### 9. move/ - 移动系统
- **index.ts**: 移动系统主逻辑
- **Move.ts**: 移动实现
- **Cross.ts**: 跨shard移动
- **crossRules.ts**: 移动规则
- **WayPoint.ts**: 路径点系统
- **types.d.ts**: 移动相关类型

#### 10. room/ - 房间系统
包含多个子模块:
- **RoomAccessor.ts**: 房间访问器
- **power/**: 房间能量相关功能
- **share/**: 房间资源共享
- **shortcut/**: 房间快捷功能
- **spawn/**: 房间Spawn管理
- **task/**: 房间任务管理

#### 11. stats/ - 统计系统
- **index.ts**: 游戏统计信息收集
- **types.d.ts**: 统计相关类型

#### 12. CombatSquad/ - 战斗小队
- **CombatSquad.ts**: 战斗小队管理
- **squadStrategies.ts**: 战斗策略
- **types.d.ts**: 战斗相关类型

### src/mount/ - 游戏对象原型拓展

#### 1. CreepExtension/ - Creep扩展
- **CreepExtension.ts**: 为Creep对象添加自定义方法
- **types.d.ts**: Creep扩展类型定义

#### 2. GlobalExtension/ - 全局扩展
- **GlobalExtension.ts**: 为全局对象添加自定义方法
- **alias/**: 别名定义
- **extension/**: 扩展实现

#### 3. PowerCreepExtension/ - PowerCreep扩展
- **PowerCreepExtension.ts**: 为PowerCreep对象添加方法

#### 4. RoomExtension/ - 房间扩展
- **RoomExtension.ts**: 为Room对象添加自定义方法

#### 5. RoomPostionExtension/ - 房间位置扩展
- **RoomPositionExtension.ts**: 为RoomPosition对象添加方法

#### 6. StructureExtension/ - 建筑扩展
- **StructureExtension.ts**: 为Structure对象添加方法

### src/setting/ - 配置系统

- **CreepSetting.ts**: Creep配置参数
- **FactorySetting.ts**: 工厂相关设置
- **LabSetting.ts**: 实验室相关设置
- **LayoutSetting.ts**: 基地布局设置
- **OtherSetting.ts**: 其他设置
- **TransferSetting.ts**: 资源转移设置
- **WallSetting.ts**: 墙壁/ rampart 设置

### src/role/ - Creep角色系统

- **base/**: 基础角色
- **remote/**: 远程角色
- **war/**: 战斗角色
- **types/**: 角色类型定义

### src/utils/ - 工具函数

- **console/**: 控制台相关工具
- **creep/**: Creep相关工具函数
- **global/**: 全局工具函数

### test/ - 测试文件

- **integration/**: 集成测试
- **RCLTest/**: RCL升级测试
- **unit/**: 单元测试

## 项目工作流程

1. **初始化阶段**:
   - main.ts创建App实例
   - 注册所有模块
   - 调用每个模块的register()方法

2. **tick执行阶段**:
   - tickStart(): 所有模块的tick开始逻辑
   - onWork(): 所有模块的主要工作逻辑
   - afterWork(): 所有模块的后续工作逻辑
   - tickEnd(): 所有模块的tick结束逻辑

3. **对象遍历**:
   - 遍历Game.rooms, Game.structures, Game.creeps, Game.powerCreeps
   - 对每个对象应用相应的处理逻辑

## 核心设计模式

1. **插件模式**: 所有功能模块都实现IModule接口，由框架统一管理

2. **生命周期管理**: 通过标准化的生命周期方法管理模块状态

3. **原型拓展**: 通过挂载方式为原生游戏对象扩展功能

4. **模块化配置**: 将各种配置参数集中管理

这个项目构建了一个功能完整的Screeps AI系统，涵盖了从自动规划、建筑管理、Creep控制、能量管理到战斗系统的全方位功能，具有良好的扩展性和维护性。
