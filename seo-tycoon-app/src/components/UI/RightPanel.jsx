import { useState } from 'react';
import { useGame } from '../../state/context/GameContext';
import EventModal from './EventModal';
import './RightPanel.css';

const RightPanel = () => {
  const { state, dispatch } = useGame();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleClearNotification = (id) => {
    dispatch({ type: 'CLEAR_NOTIFICATION', payload: id });
  };

  return (
    <div className="right-panel">
      <div className="panel-section">
        <h3>Notifications</h3>
        <div className="notifications-list">
          {state.ui.notifications.length === 0 ? (
            <div className="no-notifications">No new notifications</div>
          ) : (
            state.ui.notifications.slice(-10).reverse().map((notif) => (
              <div key={notif.id} className={`notification ${notif.type}`}>
                <div className="notification-content">
                  <span className="notification-icon">
                    {notif.type === 'success' && '✅'}
                    {notif.type === 'error' && '❌'}
                    {notif.type === 'warning' && '⚠️'}
                    {notif.type === 'info' && 'ℹ️'}
                  </span>
                  <span className="notification-message">{notif.message}</span>
                </div>
                <button
                  className="btn-clear-notif"
                  onClick={() => handleClearNotification(notif.id)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel-section">
        <h3>Active Events</h3>
        <div className="events-list">
          {state.activeEvents.length === 0 ? (
            <div className="no-events">No active events</div>
          ) : (
            state.activeEvents.filter(e => !e.resolved).map((event) => (
              <div
                key={event.id}
                className="event-card"
                onClick={() => setSelectedEvent(event)}
                style={{ cursor: 'pointer' }}
              >
                <div className="event-title">{event.title}</div>
                <div className="event-desc">{event.description.substring(0, 80)}...</div>
                {event.choices && event.choices.length > 0 && !event.selectedChoice && (
                  <div className="event-action-needed">⚠️ Action needed!</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <div className="panel-section">
        <h3>Quick Stats</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Employees</div>
            <div className="stat-value">{state.agency.employees.length}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Projects</div>
            <div className="stat-value">
              {state.agency.projects.filter((p) => p.status === 'active').length}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Avg Happiness</div>
            <div className="stat-value">
              {state.agency.employees.length > 0
                ? Math.round(
                    state.agency.employees.reduce((sum, e) => sum + e.happiness, 0) /
                      state.agency.employees.length
                  )
                : 0}
              %
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Avg Energy</div>
            <div className="stat-value">
              {state.agency.employees.length > 0
                ? Math.round(
                    state.agency.employees.reduce((sum, e) => sum + e.energy, 0) /
                      state.agency.employees.length
                  )
                : 0}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
