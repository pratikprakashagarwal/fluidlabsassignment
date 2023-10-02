import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./homecss.css";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refresh, setrefresh] = useState(1);
  const [countonpage, setcountonpage] = useState(1);
  const [limit, setlimit] = useState(4);
  const editbutton = (p, q, r) => {
    const obj = [p, q, r];
    setTimeout(() => {
      navigate("/createproduct", { state: { obj } });
    }, 500);
  };
  const token = localStorage.getItem('userToken');
  const deletebutton = (p) => {
    
    axios
      .delete("http://localhost:5000/api/deleteproduct/" + p,{
        headers: {
          Authorization: `${token}`,
        }})
      .then((response) => {
        console.log("This" + JSON.stringify(response));
        setrefresh(refresh + 1);
      })
      .catch((error) => {
        alert("Oops! Some error occured.");
      });
  };

  const handleButtonClick = () => {
    setTimeout(() => {
      navigate("/createproduct");
    }, 500);
  };

  useEffect(() => {
    // Fetch products from the backend with pagination support
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products?page=${currentPage}&limit=${limit}`
          ,{
            headers: {
              Authorization: `${token}`,
            }}
        );

        setProducts(response.data);
        setcountonpage(response.data.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [refresh]);
  
  return (
    <React.Fragment>
      <Container className="py-5">
        <div style={{ display: "flex" }}>
          <h3 className="fw-normal">List of Products</h3>
          <button id="createproduct" onClick={handleButtonClick}>
            Create Product
          </button>
        </div>
        <br />

        <div className="grid-container">
          {countonpage == 0 ? (
            <div>
              <p class="text-danger">No More Products</p>
            </div>
          ) : (
            ""
          )}
          {products.map((pro, index) => (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">
                  {pro.idproducts}&nbsp;{pro.productname}
                </h5>
                <button
                  id={pro.idproducts}
                  onClick={() =>
                    editbutton(
                      pro.idproducts,
                      pro.productname,
                      pro.productprice
                    )
                  }
                >
                  Edit
                </button>
                <button
                  id={pro.idproducts + "Delete"}
                  onClick={() => deletebutton(pro.idproducts)}
                >
                  Delete
                </button>
              </div>
              <div className="card-body">
                <p className="card-text">{pro.productprice}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setCurrentPage(currentPage - 1);
            setrefresh(refresh + 1);
          }}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => {
            setCurrentPage(currentPage + 1);
            setrefresh(refresh + 1);
          }}
          disabled={countonpage < limit}
        >
          Next
        </button>
      </Container>
    </React.Fragment>
  );
};
export default Home;
