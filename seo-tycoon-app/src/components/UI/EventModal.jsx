import { useGame } from '../../state/context/GameContext';
import './EventModal.css';

const EventModal = ({ event, onClose }) => {
  const { state, dispatch } = useGame();

  if (!event || event.resolved) return null;

  const handleChoice = (choice) => {
    dispatch({
      type: 'APPLY_EVENT_CHOICE',
      payload: { event, choice },
    });
    onClose();
  };

  const getSeverityColor = () => {
    const colors = {
      low: '#3498db',
      medium: '#f39c12',
      high: '#e74c3c',
    };
    return colors[event.severity] || '#95a5a6';
  };

  const canAffordChoice = (choice) => {
    return !choice.cost || state.money >= choice.cost;
  };

  const meetsRequirements = (choice) => {
    if (!choice.requirements) return true;

    if (choice.requirements.minEmployees) {
      return state.agency.employees.length >= choice.requirements.minEmployees;
    }

    return true;
  };

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="event-modal-header" style={{ borderColor: getSeverityColor() }}>
          <h2>{event.title}</h2>
          <div className="event-severity" style={{ backgroundColor: getSeverityColor() }}>
            {event.severity} severity
          </div>
        </div>

        <div className="event-modal-body">
          <p className="event-description">{event.description}</p>

          {event.immediateEffects && Object.keys(event.immediateEffects).length > 0 && (
            <div className="immediate-effects">
              <h4>Immediate Effects:</h4>
              <ul>
                {event.immediateEffects.allProjectsProductivity && (
                  <li>
                    📉 Projects Productivity:{' '}
                    {(event.immediateEffects.allProjectsProductivity * 100).toFixed(0)}%
                  </li>
                )}
                {event.immediateEffects.reputation && (
                  <li>⭐ Reputation: +{event.immediateEffects.reputation}</li>
                )}
                {event.immediateEffects.newClients && (
                  <li>👥 New Clients: +{event.immediateEffects.newClients}</li>
                )}
              </ul>
            </div>
          )}

          {event.duration > 0 && (
            <div className="event-duration">
              <span className="duration-icon">⏰</span>
              <span>This event will last {event.duration} days</span>
            </div>
          )}

          {event.choices && event.choices.length > 0 && (
            <div className="event-choices">
              <h4>How will you respond?</h4>
              <div className="choices-grid">
                {event.choices.map((choice) => {
                  const canAfford = canAffordChoice(choice);
                  const meetsReqs = meetsRequirements(choice);
                  const isDisabled = !canAfford || !meetsReqs;

                  return (
                    <button
                      key={choice.id}
                      className={`choice-btn ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => !isDisabled && handleChoice(choice)}
                      disabled={isDisabled}
                    >
                      <div className="choice-header">
                        <h5>{choice.label}</h5>
                        {choice.cost > 0 && (
                          <span className={`choice-cost ${canAfford ? '' : 'cant-afford'}`}>
                            ${choice.cost.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="choice-description">{choice.description}</p>

                      {choice.successChance && (
                        <div className="success-chance">
                          Success Chance: {(choice.successChance * 100).toFixed(0)}%
                        </div>
                      )}

                      {!canAfford && <div className="warning">❌ Not enough money</div>}
                      {!meetsReqs && (
                        <div className="warning">
                          ❌ Requirements not met
                          {choice.requirements?.minEmployees &&
                            ` (need ${choice.requirements.minEmployees} employees)`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="event-modal-footer">
          <button className="btn-close-modal" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
