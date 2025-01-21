import React from "react";

const StatusLegend = () => {
  return (
    <div className="status-legend">
      <div className="legend-item">
        <div className="status-legend-deleted"></div>
        <span>Deleted</span>
      </div>
      <div className="legend-item">
        <div className="status-legend-active"></div>
        <span>Active</span>
      </div>
      <div className="legend-item">
        <div className="status-legend-inactive"></div>
        <span>Inactive</span>
      </div>
    </div>
  );
};

export default StatusLegend;
