import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  removeNotification,
  selectNotifications,
} from '../features/notifications/notificationsSlice';

const typeClassName = {
  success: 'bg-emerald-600 text-white border-emerald-700',
  info: 'bg-blue-600 text-white border-blue-700',
  error: 'bg-red-600 text-white border-red-700',
};

const ToastNotification = ({ notification, onClose, onNavigate }) => {
  useEffect(() => {
    if (notification.persist || notification.duration === 0) {
      return undefined;
    }

    const timer = setTimeout(() => {
      onClose();
    }, notification.duration || 3000);

    return () => clearTimeout(timer);
  }, [notification.duration, notification.persist, onClose]);

  const handleClick = () => {
    if (notification.linkTo) {
      onNavigate(notification.linkTo);
    }
  };

  return (
    <div
      className={`${
        notification.persist ? '' : 'animate-toast'
      } shadow-lg rounded-lg border px-4 py-3 min-w-[260px] max-w-[360px] ${
        typeClassName[notification.type] || typeClassName.success
      } ${notification.linkTo ? 'cursor-pointer' : ''}`}
      style={
        notification.persist
          ? undefined
          : { animationDuration: `${notification.duration || 3000}ms` }
      }
      role="status"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm font-medium leading-snug">
          {notification.message}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-white/80 hover:text-white transition"
          aria-label="Fermer la notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const ToastNotifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notifications = useSelector(selectNotifications);

  if (!notifications.length) return null;

  const topNotifications = notifications.filter(
    (notification) => notification.position !== 'bottom'
  );
  const bottomNotifications = notifications.filter(
    (notification) => notification.position === 'bottom'
  );

  return (
    <>
      {topNotifications.length > 0 && (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
          {topNotifications.map((notification) => (
            <ToastNotification
              key={notification.id}
              notification={notification}
              onClose={() => dispatch(removeNotification(notification.id))}
              onNavigate={navigate}
            />
          ))}
        </div>
      )}
      {bottomNotifications.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3">
          {bottomNotifications.map((notification) => (
            <ToastNotification
              key={notification.id}
              notification={notification}
              onClose={() => dispatch(removeNotification(notification.id))}
              onNavigate={navigate}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ToastNotifications;
