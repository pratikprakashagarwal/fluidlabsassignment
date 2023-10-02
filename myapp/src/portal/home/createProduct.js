import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const CreateProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  useEffect(() => {
    if (location.state == undefined) {
      console.log("NOT FOUND");
    } else {
      console.log("FOUND" + JSON.stringify(location.state.obj));
      setname(location.state.obj[1]);
      setprice(location.state.obj[2]);
    }
  }, []);
  const createprodAPI = "http://localhost:5000/api/createproduct";

  function namechange(e) {
    e.preventDefault();
    console.log("THE" + JSON.stringify(e.target.value));
    setname(e.target.value);
  }

  function pricechange(e) {
    e.preventDefault();
    setprice(e.target.value);
  }

  const submitprodform = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('user-token');

    if (location.state == undefined) {
      const formDataJSON = { productname: name, productprice: price };
      console.log("THEEEE" + JSON.stringify(formDataJSON));
      axios
        .post(createprodAPI, formDataJSON ,{
          headers: {
            Authorization: `${token}`,
          }})
        .then((response) => {
          console.log("This" + JSON.stringify(response));
          setTimeout(() => {
            navigate("/");
          }, 500);
        })
        .catch((error) => {
          alert("Oops! Some error occured.");
        });
    } else {
      const formDataJSON = {
        idproducts: location.state.obj[0],
        productname: name,
        productprice: price,
      };
      console.log("THEEEE" + JSON.stringify(formDataJSON));
      axios
        .put(
          "http://localhost:5000/api/createproduct/" + location.state.obj[0],
          formDataJSON ,{
            headers: {
              Authorization: `${token}`,
            }}
        )
        .then((response) => {
          console.log("This" + JSON.stringify(response));

          setTimeout(() => {
            navigate("/");
          }, 500);
        })
        .catch((error) => {
          alert("Oops! Some error occured.");
        });
    }
  };

  return (
    <React.Fragment>
      <Container className="my-5">
        <h2 className="fw-normal mb-5">
          {location.state != undefined ? "Edit Product" : "Create Product"}
        </h2>
        <Row>
          <Col md={{ span: 6 }}>
            <Form id="productform" onSubmit={submitprodform}>
              <FormGroup className="mb-3">
                <FormLabel htmlFor={"product-name"}>Product Name</FormLabel>
                <input
                  type={"text"}
                  className="form-control"
                  id={"product-name"}
                  name="productname"
                  value={name}
                  onChange={(event) => namechange(event)}
                  required
                />
              </FormGroup>
              <FormGroup className="mb-3">
                <FormLabel htmlFor={"product-price"}>Product Price</FormLabel>
                <input
                  type={"integer"}
                  className="form-control"
                  id={"product-price"}
                  name="productprice"
                  value={price}
                  onChange={(event) => pricechange(event)}
                  required
                />
              </FormGroup>
              <Button type="submit" className="btn-success mt-2" id="prod-btn">
                {location.state != undefined
                  ? "Edit Product"
                  : "Create Product"}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};
export default CreateProduct;
