import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAlert } from '../_action/user_action';
import AlarmTrueItem from '../components/Alarm/AlarmTrueItem';
import AlarmFalseItem from '../components/Alarm/AlarmFalseItem';
import './Alarm.css';

const Alarm = () => {
  const dispatch = useDispatch();
  const luUserId = useSelector((state) => state.user.luUserId);
  const luAccessToken = useSelector((state) => state.user.luAccessToken);
  const alertList = useSelector((state) => state.user.alertList);
  const sortAlertList = alertList?.sort((a, b) => {
    return b.alertId - a.alertId;
  });

  const trueAlertList = sortAlertList?.filter((item) => {
    if (item.checkedResult === true) return item;
  });

  const falseAlertList = sortAlertList?.filter((item) => {
    if (item.checkedResult === false) return item;
  });

  useEffect(() => {
    dispatch(getAlert(luUserId, luAccessToken));
  }, []);

  return (
    <div className='alarm'>
      {falseAlertList?.length ? (
        <div className='alarm-text'>
        새 알림
        <p id="true-text">{falseAlertList?.length}</p>
        </div>
      ) : null}
      {falseAlertList?.map((item) => (
        <AlarmFalseItem key={item.alertId} item={item} />
      ))}
      <div className='alarm-text'>
        이전 알림 
        <p id="true-text">{trueAlertList?.length}</p>
      </div>
      {trueAlertList?.map((item) => (
        <AlarmTrueItem key={item.alertId} item={item} />
      ))}
    </div>
  );
};

export default Alarm;
