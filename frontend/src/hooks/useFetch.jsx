import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useFetchData = (url) => {
  const { access } = useSelector((state) => state.user);
  const [fetchedData, setFetchedData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorFetch, setErrorFetch] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    setLoadingData(true);
    setErrorFetch(null);

    try {
      const { data } = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setFetchedData(data);
    } catch (error) {
      setErrorFetch(error.message || "An error occurred while fetching data.");
      toast.error(`Error fetching data: ${error.message || error}`);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [access, navigate]);

  return { fetchedData, loadingData, errorFetch,fetchData };
};

export default useFetchData;
