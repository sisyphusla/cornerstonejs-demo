import * as cornerstoneTools from '@cornerstonejs/tools';
import {
  ToolsEnums,
  WindowLevelTool,
  PanTool,
  ZoomTool,
  StackScrollTool,
} from './cornerstoneInit';
import { ToolGroupManager } from '@cornerstonejs/tools';

const { MouseBindings } = ToolsEnums;

export function setupTools({ element }) {
  // 添加工具
  cornerstoneTools.addTool(WindowLevelTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(StackScrollTool);

  // 創建工具組
  const toolGroup = ToolGroupManager.createToolGroup('CT_TOOLGROUP_ID');
  toolGroup.addViewport('CT_AXIAL', 'myRenderingEngine');

  // 窗位調整配置
  const windowLevelConfig = {
    mousePointerStepRatio: 0.01,  // 控制窗位變更速度
    minWindowWidth: 1,
    maxWindowWidth: 20000,
  };

  // 配置工具
  toolGroup.addTool(WindowLevelTool.toolName, {
    configuration: windowLevelConfig
  });
  toolGroup.addTool(PanTool.toolName);
  toolGroup.addTool(ZoomTool.toolName);
  toolGroup.addTool(StackScrollTool.toolName);

  // 設置工具快捷鍵
  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [{ mouseButton: MouseBindings.Primary }],
  });
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [{ mouseButton: MouseBindings.Auxiliary }],
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [{ mouseButton: MouseBindings.Secondary }],
  });
  toolGroup.setToolActive(StackScrollTool.toolName, {
    bindings: [{ mouseButton: MouseBindings.Wheel }],
  });

  return toolGroup;
}