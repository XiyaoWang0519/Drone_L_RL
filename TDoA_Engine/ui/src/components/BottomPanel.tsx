import { ReactNode, useState } from "react";

export type TabId = "pose" | "anchors" | "clocks" | "connection";

interface Tab {
  id: TabId;
  label: string;
}

interface BottomPanelProps {
  tabs: Tab[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function TabNav({ 
  tabs, 
  activeTab, 
  onTabChange 
}: { 
  tabs: Tab[]; 
  activeTab: TabId; 
  onTabChange: (tab: TabId) => void;
}) {
  return (
    <div className="tab-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item${activeTab === tab.id ? " active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function BottomPanel({ tabs, activeTab, onTabChange, children }: BottomPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bottom-panel${collapsed ? " collapsed" : ""}`} style={{ height: collapsed ? 48 : 280 }}>
      <div className="bottom-panel-header" style={{ position: "relative" }}>
        <TabNav tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        <button 
          className="panel-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand panel" : "Collapse panel"}
        >
          <ChevronIcon />
        </button>
      </div>
      {!collapsed && (
        <div className="bottom-panel-content">
          {children}
        </div>
      )}
    </div>
  );
}
