import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useFetchData = (url) => {
    const { access } = useSelector((state) => state.user);
    const [fetchedData, setFetchedData] = useState([]);
  const navigate = useNavigate();


    const fetchData = async () => {
        if (!access) {
          toast.error("User is not authenticated. Please log in.");
          return;
        }
        try {
          const { data } = await axios.get(url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          });
          setFetchedData(data);
        } catch (error) {
          toast.error("Error fetching class:", error.message || error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, [access, navigate]);


  return {fetchedData}
}

export default useFetchData