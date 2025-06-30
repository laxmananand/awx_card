import React, { useState } from "react";
import CardList from "./CardList"; // Import your CardList component

function ParentComponent() {
  const [data, setData] = useState([]); // State to manage card list
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  return (
    <div>
      <CardList
        setShowDetails={setShowDetails}
        data={data}
        setSelectedRowData={setSelectedRowData}
        setData={setData} // Pass setData for refreshCardList
      />
    </div>
  );
}

export default ParentComponent;
