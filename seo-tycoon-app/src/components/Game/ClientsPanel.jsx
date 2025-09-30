import { useGame } from '../../state/context/GameContext';
import './ClientsPanel.css';

const ClientsPanel = () => {
  const { state, dispatch } = useGame();

  const handleAcceptClient = (client) => {
    dispatch({
      type: 'ACCEPT_PROJECT',
      payload: { project: client },
    });
  };

  return (
    <div className="clients-panel">
      <div className="panel-header-main">
        <h2>🤝 Available Clients</h2>
        <div className="client-count">{state.availableClients.length} clients available</div>
      </div>

      {state.availableClients.length === 0 ? (
        <div className="empty-state">
          <p>No clients available right now. New clients appear daily!</p>
        </div>
      ) : (
        <div className="clients-grid">
          {state.availableClients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-header">
                <div className="client-icon">🏢</div>
                <div className="client-info">
                  <h3>{client.name}</h3>
                  <span className="client-type">{client.type.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="client-budget">
                <span className="budget-label">Budget</span>
                <span className="budget-value">${client.budget}</span>
              </div>

              <div className="client-requirements">
                <h4>Requirements:</h4>
                <div className="requirements-grid">
                  <div className="requirement-item">
                    <span className="req-icon">✍️</span>
                    <span className="req-label">Content</span>
                    <span className="req-stars">{'⭐'.repeat(client.requirements.content)}</span>
                  </div>
                  <div className="requirement-item">
                    <span className="req-icon">⚙️</span>
                    <span className="req-label">Technical</span>
                    <span className="req-stars">{'⭐'.repeat(client.requirements.technical)}</span>
                  </div>
                  <div className="requirement-item">
                    <span className="req-icon">🔗</span>
                    <span className="req-label">Links</span>
                    <span className="req-stars">
                      {'⭐'.repeat(client.requirements.linkBuilding)}
                    </span>
                  </div>
                </div>
              </div>

              {client.deadline && (
                <div className="client-deadline">
                  <span className="deadline-icon">⏰</span>
                  <span>Expires: Day {client.expiresAt}</span>
                </div>
              )}

              <button
                className="btn-accept-client"
                onClick={() => handleAcceptClient(client)}
              >
                Accept Project
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="active-clients-section">
        <h3>📋 Active Clients</h3>
        {state.agency.projects.filter((p) => p.status === 'active').length === 0 ? (
          <div className="no-active-clients">No active clients yet</div>
        ) : (
          <div className="active-clients-list">
            {state.agency.projects
              .filter((p) => p.status === 'active')
              .map((project) => (
                <div key={project.id} className="active-client-item">
                  <div className="client-name-active">{project.clientName}</div>
                  <div className="client-progress-active">
                    <div className="progress-bar-small">
                      <div
                        className="progress-fill-small"
                        style={{ width: `${project.overallProgress}%` }}
                      />
                    </div>
                    <span className="progress-text-small">
                      {Math.round(project.overallProgress)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsPanel;
