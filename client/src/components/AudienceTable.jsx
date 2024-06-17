import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const AudienceTable = ({
  audiences,
  audienceSearch,
  setAudienceSearch,
  sendingAudienceId,
  sendMessage,
  messageStats,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const canGoNext = endIndex < audiences.length;
  const canGoPrev = currentPage > 1;

  const renderMessageStats = (stats) => {
    if (!stats) return "NA";

    const { sentCount, totalCount } = stats;
    const successRate = (sentCount / totalCount) * 100;

    return (
      <div>
        <p className="text-green">Sent: {sentCount}</p>
        <p className="text-red">Failed: {totalCount - sentCount}</p>
        <p className="font-bold">Success Rate: {successRate.toFixed(2)}%</p>
      </div>
    );
  };

  const tableHeaders = [
    { name: "Name", key: "name" },
    { name: "Audience Size", key: "size" },
    { name: "Status", key: "status" },
    { name: "Send Message", key: "sendMessage" },
    { name: "Message Stats", key: "messageStats" },
  ];

  return (
    <div>
      <div className="mb-4 mt-4">
        <input
          type="text"
          placeholder="Search Audiences"
          value={audienceSearch}
          onChange={(e) => setAudienceSearch(e.target.value)}
          className="border border-gray rounded-md p-2 mb-2"
        />
      </div>

      <div className="block w-full overflow-x-auto">
        <table className="items-center bg-transparent w-full border-collapse mt-2">
          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
                >
                  {header.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {audiences
              .filter((audience) =>
                audience.name
                  .toLowerCase()
                  .includes(audienceSearch.toLowerCase())
              )
              .slice(startIndex, endIndex)
              .map((audience) => (
                <tr
                  className="transition-all duration-300 hover:font-bold hover:bg-pale-white"
                  key={audience._id}
                >
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {audience.name}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {audience.customerIds.length}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {audience.status}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <button
                      disabled={
                        audience.status === "DONE" ||
                        sendingAudienceId === audience._id
                      }
                      className={`bg-dark hover:scale-110 transition-all duration-300 text-pale-white py-2 px-6 rounded-full ${
                        audience.status === "DONE" ||
                        sendingAudienceId === audience._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        sendMessage(audience._id, audience.customerIds)
                      }
                    >
                      {sendingAudienceId === audience._id
                        ? "Sending..."
                        : "Send"}
                    </button>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {renderMessageStats(messageStats[audience._id])}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 ml-2">
        <button
          onClick={goToPrevPage}
          disabled={!canGoPrev}
          className={`bg-dark hover:scale-110 transition-all duration-300 text-pale-white py-2 px-6 rounded-full mr-2 ${
            !canGoPrev ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <IoIosArrowBack className="inline-block mr-1" />
          Prev
        </button>
        <button
          onClick={goToNextPage}
          disabled={!canGoNext}
          className={`bg-dark hover:scale-110 transition-all duration-300 text-pale-white py-2 px-6 rounded-full ${
            !canGoNext ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
          <IoIosArrowForward className="inline-block ml-1" />
        </button>
      </div>
    </div>
  );
};

export default AudienceTable;