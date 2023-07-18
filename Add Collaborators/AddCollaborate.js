import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import "./AddCollaborate.css";
import { BASE_URL } from "../../../constants/config";

function AddCollaborate() {
  const [options, setOptions] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [dataCount, setDataCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [close, setClose] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  // New state variable

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredResults = options.filter((option) =>
      option.fullName.toLowerCase().includes(searchTerm)
    );
    setSearchResults(filteredResults);
  };

  const handleClose = () => {
    setClose(true);
  };

  const getEmailsString = () => {
    const uniqueEmails = Array.from(
      new Set(selectedMembers.map((member) => member.email))
    );
    return uniqueEmails.join(", ");
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMemberClick = (member) => {
    setSelectedMembers((prevMembers) => [...prevMembers, member]);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(BASE_URL + "/v1/org/getmember-details");
      const data = response.data.data;
      const count = data.length;
      setDataCount(count);
      setOptions(data);
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching options data:", error);
    }
  };

  return (
    <div
      className="addcollab-page"
      style={{ display: close ? "none" : "block" }}
    >
      <div className="addcollab-container">
        <div className="addcollab-head">
          <span>Add Collaborate</span>
          <CloseIcon onClick={handleClose} />
        </div>
        <div className="addcollab-invite">
          <span>
            <b>Invite</b>
          </span>
          <div className="inp-btn-collab">
            <input
              placeholder="Email,comma separated"
              value={getEmailsString()}
            />
            <button>Send Invite</button>
          </div>
        </div>
        <div className="addcollab-collaboarters">
          <div className="collabs">
            <span>
              <b>Collaborators ({dataCount})</b>
            </span>
          </div>
          <div className="collab-search">
            <SearchIcon style={{ color: "#001325" }} />

            <input
              type="text"
              placeholder="Search Collaborator"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="collab-members">
            {searchResults.map((option, index) => (
              <div
                className="collab-members-list"
                style={{ marginBottom: "8px" }}
                key={option.id}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="collab-span"
                  onClick={() => handleMemberClick(option)}
                >
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt=""
                  />
                  <span>{option.fullName}</span>
                </div>
                {hoveredIndex === index && <button>Remove</button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCollaborate;
