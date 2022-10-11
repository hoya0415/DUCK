import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Offcanvas, Modal, } from "react-bootstrap";
import { DensityMedium, Logout, RemoveCircleOutline, SettingsOutlined, HttpsOutlined } from "@mui/icons-material";
import floatDuck from "../../assets/흘러가는오리-투명.gif";
import { withdrawalUser } from "../../_action/user_action";


function ProfileSideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [withdrawalModalShow, setWithdrawalModalShow] = useState(false);
  const handleModalClose = () => setWithdrawalModalShow(false);
  const userId = useSelector((state) => state.user.luUserId);


  const accountLogout = (event) => {
    localStorage.clear();
    navigate("/");
  };

  const openWithdrawalModal = () => {
    setWithdrawalModalShow(true);
  }

  const accountWithdrawal = (evnet) => {
    dispatch(withdrawalUser(userId))
    localStorage.clear();
    navigate("/")
  }

  return (
    <>
      <Button>
        <DensityMedium
          fontSize="large"
          className="top-bar-button"
          onClick={handleShow}
        />
      </Button>

      <Offcanvas
        className="slide-bar"
        show={show}
        onHide={handleClose}
        placement="end"
      >
        <Offcanvas.Header>
          <DensityMedium
            fontSize="large"
            className="side-bar-btn"
            onClick={handleClose}
          />
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="side-bar-text">
            <span style={{cursor:'pointer'}} 
              onClick={() =>navigate(`/profileupdate/${userId}`)}> 
              <SettingsOutlined className="profile-logout-button"/>
              프로필수정
            </span>

            <span style={{cursor:'pointer'}} 
              onClick={() =>navigate(`/changepassword/${userId}`)}>
              <HttpsOutlined className="profile-logout-button"/>
              비밀번호변경
            </span>

            <div style={{cursor:'pointer'}}>
              <Logout className="profile-logout-button" />
              <span onClick={accountLogout}>로그아웃</span>
            </div>

            <div style={{cursor:'pointer'}}>
              <RemoveCircleOutline className="profile-logout-button"/>
              <span onClick={openWithdrawalModal}>회원탈퇴</span>
            </div>

          </div>

          <img
            className="side-bar-float-duck-img-1"
            src={floatDuck}
            alt="흘러가는 오리"
          />
          <img
            className="side-bar-float-duck-img-2"
            src={floatDuck}
            alt="흘러가는 오리"
          />
        </Offcanvas.Body>
      </Offcanvas>
      <>
        <Modal show={withdrawalModalShow} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>회원탈퇴</Modal.Title>
          </Modal.Header>
          <Modal.Body>정말로 탈퇴하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button className="withdrawalBtn" onClick={accountWithdrawal}>
              탈퇴
            </Button>
            <Button className="withdrawalBtn" onClick={handleModalClose}>
              취소
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}

export default ProfileSideBar;
