import React from "react";

const CampaignCard = ({
  campaign,
  isSelected,
  handleCampaignChange,
  handleCampaignDelete,
  handleCampaignEdit,
  index,
}) => {
  return (
    <div
      className={`border transition-all border-gray rounded-lg p-4 cursor-pointer ${
        isSelected ? "bg-pale-white text-black" : ""
      }`}
      onClick={() => handleCampaignChange(campaign._id, campaign.message)}
    >
      <h2 className="text-lg font-bold mb-2 flex items-center">
        {campaign.name}
        {index === 0 && (
          <span className="ml-2 bg-warn text-black px-2 py-1 rounded-full text-xs">
            Latest
          </span>
        )}
      </h2>
      <p className="text-sm">{campaign.message}</p>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="bg-dark hover:scale-110 transition-all duration-300 text-pale-white px-2 rounded-md w-1/2"
          onClick={(e) => {
            e.stopPropagation();
            handleCampaignDelete(campaign._id);
          }}
        >
          Delete
        </button>
        <button
          className="bg-dark hover:scale-110 transition-all duration-300 text-white px-2 rounded-md w-1/2"
          onClick={(e) => {
            e.stopPropagation();
            handleCampaignEdit(campaign._id);
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;
