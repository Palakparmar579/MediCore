import React, { useEffect, useState } from "react";
import { FaInbox } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../Config/Axios";
import ConfirmationPopup from "../../component/CommonPages/ConfirmationPopup";
import useTitle from "../../hooks/userTitle";


const NoRequests = () => {
  useTitle("Forget Requests")
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token =localStorage.getItem("token");

  const [requestId, setRequestId] = useState(null);
  const [currentAction, setCurrentAction] = useState(null);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [userRequest, setUserRequest] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    fetchPaginationRequest(page);
  }, [page]);

  const fetchPaginationRequest = async (pageNumber = 1) => {
    try {
      const response = await api.get(
        `/api/request/pagination?page=${pageNumber}&limit=${limit}`
      );
      setUserRequest(response.data.data);
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleAction = (id, actionType) => {
    setShowActionPopup(true);
    setActionId(id);
    setSelectedAction(actionType);
    setCurrentAction(actionType);
  };

  const handleActionConfirm = async () => {
    try {
      setRequestId(actionId);

     

      const response = await api.post(
        "/api/request/updateRequest",
        { id: actionId, action: selectedAction },
       
      );

      toast.success(response.data.message);
      fetchPaginationRequest(page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }

    setShowActionPopup(false);
  };

  const handleActionCancel = () => setShowActionPopup(false);
  const handleActionCross = () => setShowActionPopup(false);

  const nextAction = currentAction === "accepted" ? "accept" : "reject";


  const getRoleStyles = (role) => {
    switch (role) {
      case "doctor":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "nurse":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "patient":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <>
      {userRequest.length > 0 ? (
        <div className="min-h-screen w-full flex flex-col px-6 sm:px-10">

       
          {showActionPopup && (
            <ConfirmationPopup
             heading={`Confirm ${nextAction} request`}
              handleCancel={handleActionCancel}
              handleConfirm={handleActionConfirm}
              handleCross={handleActionCross}
              currentAction={currentAction}
              message={`Are you sure you want to ${nextAction} this request?`}
              loading={requestId}
            />
          )}

          <div className="w-full max-w-5xl mt-3">

         
            <div className="mb-15 text-left">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#00304e] to-[#005f73] bg-clip-text text-transparent">
                Pending User Requests
              </h2>
              <p className="text-gray-600 mt-1 text-md">
                Review incoming user requests and approve or reject access.
              </p>
            </div>

           
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="w-full overflow-x-auto">

                <table className="w-full">

                
                  <thead className="bg-gradient-to-r from-[#00304e] to-[#005f73] text-white">
                    <tr>
                      <th className="px-3 py-3 text-center">Role</th>
                      <th className="px-3 py-3 text-center">Email</th>
                      <th className="px-3 py-3 text-center">Status</th>
                      <th className="px-3 py-3 text-center">Action</th>
                    </tr>
                  </thead>

                 
                  <tbody>
                    {userRequest.map((items) => (
                      <tr
                        key={items._id}
                        className="border-t hover:bg-gray-50 transition"
                      >

                      
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getRoleStyles(
                              items.role
                            )}`}
                          >
                            {items.role}
                          </span>
                        </td>

                       
                        <td className="px-3 py-3 text-center text-gray-700">
                          {items.email}
                        </td>

                       
                        <td className="px-3 py-3 text-center">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              items.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : items.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {items.status}
                          </span>
                        </td>

                      
                        <td className="p-3">
                          <div className="flex justify-center gap-3">

                            {items.status === "accepted" ? (
                              <button className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-lg cursor-not-allowed">
                                Accepted
                              </button>
                            ) : items.status === "rejected" ? (
                              <button className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg cursor-not-allowed">
                                Rejected
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleAction(items._id, "accepted")
                                  }
                                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                  Accept
                                </button>

                                <button
                                  onClick={() =>
                                    handleAction(items._id, "rejected")
                                  }
                                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>

          </div>
         

     
  {totalPages > 1 && userRequest.length > 0 && (
<div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 mt-4 pb-4 text-xs">


  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="px-2 py-1 rounded-md border text-gray-600 
    hover:bg-[#00455c] hover:text-white transition 
    disabled:opacity-40 disabled:cursor-not-allowed"
  >
    Pre
  </button>

 
  <div className="flex items-center gap-1">
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
      <button
        key={pg}
        onClick={() => setPage(pg)}
        className={`w-6 h-6 flex items-center justify-center rounded text-[11px] border transition
        ${
          page === pg
            ? "bg-[#00455c] text-white border-[#00455c]"
            : "bg-white text-gray-600 hover:bg-gray-100"
        }`}
      >
        {pg}
      </button>
    ))}
  </div>

  
  <button
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
    className="px-2 py-1 rounded-md border text-gray-600 
    hover:bg-[#00455c] hover:text-white transition 
    disabled:opacity-40 disabled:cursor-not-allowed"
  >
    Next
  </button>

</div>
)}
        </div>

      

      ) : (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 sm:px-40">
          <div className="bg-[#00304e]/10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <FaInbox className="text-[#00304e] text-3xl" />
          </div>

          <h2 className="text-xl font-semibold text-[#00304e]">
            No Requests Found
          </h2>

          <p className="text-gray-500 mt-2 max-w-md">
            There are currently no pending requests.
          </p>
        </div>
      )}
    </>
  );
};

export default NoRequests;