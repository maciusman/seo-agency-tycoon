import { useState } from 'react';
import { useGame } from '../../state/context/GameContext';
import researchData from '../../data/research.json';
import './ResearchPanel.css';

const ResearchPanel = () => {
  const { state, dispatch } = useGame();
  const [selectedResearch, setSelectedResearch] = useState(null);

  const isResearched = (id) => {
    return state.research.completedResearch.includes(id);
  };

  const isAvailable = (research) => {
    // Check if all prerequisites are met
    if (research.prerequisites.length === 0) return true;
    return research.prerequisites.every((prereqId) => isResearched(prereqId));
  };

  const isResearching = (id) => {
    return state.research.activeResearch.id === id;
  };

  const canAfford = (research) => {
    return state.money >= research.cost;
  };

  const handleStartResearch = (research) => {
    if (!canAfford(research)) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: `Not enough money! Need $${research.cost}`,
          type: 'error',
        },
      });
      return;
    }

    if (!isAvailable(research)) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Prerequisites not met!',
          type: 'error',
        },
      });
      return;
    }

    if (state.research.activeResearch.id) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'Already researching something!',
          type: 'warning',
        },
      });
      return;
    }

    dispatch({
      type: 'START_RESEARCH',
      payload: { research },
    });

    setSelectedResearch(null);
  };

  const getResearchStatus = (research) => {
    if (isResearched(research.id)) return 'completed';
    if (isResearching(research.id)) return 'active';
    if (isAvailable(research)) return 'available';
    return 'locked';
  };

  const departments = {
    content: { name: 'Content', color: '#3498db' },
    technical: { name: 'Technical', color: '#e74c3c' },
    linkbuilding: { name: 'Link Building', color: '#2ecc71' },
    business: { name: 'Business', color: '#f39c12' },
    meta: { name: 'Meta', color: '#9b59b6' },
  };

  const groupedResearch = researchData.reduce((acc, research) => {
    if (!acc[research.department]) {
      acc[research.department] = [];
    }
    acc[research.department].push(research);
    return acc;
  }, {});

  return (
    <div className="research-panel">
      <div className="panel-header-main">
        <h2>🔬 Research & Development</h2>
        <div className="research-status">
          {state.research.activeResearch.id ? (
            <div className="active-research-badge">
              <span className="badge-icon">⚗️</span>
              <span className="badge-text">Researching...</span>
              <div className="research-progress-mini">
                <div
                  className="research-progress-fill"
                  style={{
                    width: `${(state.research.activeResearch.progress / state.research.activeResearch.duration) * 100}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="no-research-badge">No active research</div>
          )}
        </div>
      </div>

      <div className="research-departments">
        {Object.entries(groupedResearch).map(([dept, researches]) => (
          <div key={dept} className="department-section">
            <h3 className="department-title" style={{ color: departments[dept].color }}>
              {departments[dept].name}
            </h3>
            <div className="research-grid">
              {researches.map((research) => {
                const status = getResearchStatus(research);
                const affordable = canAfford(research);

                return (
                  <div
                    key={research.id}
                    className={`research-card ${status}`}
                    onClick={() => setSelectedResearch(research)}
                  >
                    <div className="research-icon">{research.icon}</div>
                    <div className="research-name">{research.name}</div>
                    <div className="research-cost-badge">
                      <span className={affordable || status === 'completed' ? '' : 'cant-afford'}>
                        ${research.cost.toLocaleString()}
                      </span>
                    </div>
                    <div className="research-duration">{research.duration} days</div>

                    {status === 'locked' && (
                      <div className="research-locked-overlay">
                        <span>🔒</span>
                      </div>
                    )}
                    {status === 'completed' && (
                      <div className="research-completed-overlay">
                        <span>✅</span>
                      </div>
                    )}
                    {status === 'active' && (
                      <div className="research-active-overlay">
                        <div className="spinner">⚗️</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selectedResearch && (
        <div className="research-modal-overlay" onClick={() => setSelectedResearch(null)}>
          <div className="research-modal" onClick={(e) => e.stopPropagation()}>
            <div className="research-modal-header">
              <div className="research-modal-icon">{selectedResearch.icon}</div>
              <h3>{selectedResearch.name}</h3>
            </div>

            <div className="research-modal-body">
              <p className="research-description">{selectedResearch.description}</p>

              <div className="research-details">
                <div className="detail-row">
                  <span className="detail-label">Cost:</span>
                  <span className="detail-value money">
                    ${selectedResearch.cost.toLocaleString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{selectedResearch.duration} days</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department:</span>
                  <span
                    className="detail-value"
                    style={{ color: departments[selectedResearch.department].color }}
                  >
                    {departments[selectedResearch.department].name}
                  </span>
                </div>
              </div>

              {selectedResearch.prerequisites.length > 0 && (
                <div className="prerequisites">
                  <h4>Prerequisites:</h4>
                  <ul>
                    {selectedResearch.prerequisites.map((prereqId) => {
                      const prereq = researchData.find((r) => r.id === prereqId);
                      const met = isResearched(prereqId);
                      return (
                        <li key={prereqId} className={met ? 'met' : 'not-met'}>
                          {met ? '✅' : '❌'} {prereq.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="research-effects">
                <h4>Effects:</h4>
                <ul>
                  {selectedResearch.effects.contentTaskSpeed && (
                    <li>📝 Content tasks {(selectedResearch.effects.contentTaskSpeed * 100).toFixed(0)}% faster</li>
                  )}
                  {selectedResearch.effects.technicalTaskSpeed && (
                    <li>⚙️ Technical tasks {(selectedResearch.effects.technicalTaskSpeed * 100).toFixed(0)}% faster</li>
                  )}
                  {selectedResearch.effects.linkBuildingTaskSpeed && (
                    <li>🔗 Link building {(selectedResearch.effects.linkBuildingTaskSpeed * 100).toFixed(0)}% faster</li>
                  )}
                  {selectedResearch.effects.allProjectsProductivity && (
                    <li>📈 All projects {(selectedResearch.effects.allProjectsProductivity * 100).toFixed(0)}% more productive</li>
                  )}
                  {selectedResearch.effects.reputationBonus && (
                    <li>⭐ +{selectedResearch.effects.reputationBonus} Reputation</li>
                  )}
                  {selectedResearch.effects.unlockFeatures && (
                    <li>🔓 Unlocks: {selectedResearch.effects.unlockFeatures.join(', ')}</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="research-modal-footer">
              {getResearchStatus(selectedResearch) === 'completed' ? (
                <div className="already-researched">Already Researched ✅</div>
              ) : getResearchStatus(selectedResearch) === 'active' ? (
                <div className="currently-researching">Currently Researching ⚗️</div>
              ) : getResearchStatus(selectedResearch) === 'locked' ? (
                <div className="locked-research">Prerequisites Not Met 🔒</div>
              ) : (
                <button
                  className={`btn-start-research ${!canAfford(selectedResearch) ? 'disabled' : ''}`}
                  onClick={() => handleStartResearch(selectedResearch)}
                  disabled={!canAfford(selectedResearch)}
                >
                  {canAfford(selectedResearch) ? 'Start Research' : 'Not Enough Money'}
                </button>
              )}
              <button className="btn-close-modal" onClick={() => setSelectedResearch(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchPanel;
