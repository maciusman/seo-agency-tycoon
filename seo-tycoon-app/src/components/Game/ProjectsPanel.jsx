import { useGame } from '../../state/context/GameContext';
import './ProjectsPanel.css';

const ProjectsPanel = () => {
  const { state, dispatch } = useGame();

  const handleAssignEmployee = (projectId, taskId, employeeId) => {
    dispatch({
      type: 'ASSIGN_EMPLOYEE_TO_TASK',
      payload: { projectId, taskId, employeeId },
    });
  };

  const activeProjects = state.agency.projects.filter((p) => p.status === 'active');
  const completedProjects = state.agency.projects.filter((p) => p.status === 'completed');

  return (
    <div className="projects-panel">
      <div className="panel-header-main">
        <h2>📊 Projects Management</h2>
        <div className="project-stats">
          <span className="stat-badge active">Active: {activeProjects.length}</span>
          <span className="stat-badge completed">Completed: {completedProjects.length}</span>
        </div>
      </div>

      {activeProjects.length === 0 ? (
        <div className="empty-state">
          <p>No active projects. Go to Clients tab to accept new projects.</p>
        </div>
      ) : (
        <div className="projects-list">
          {activeProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <div className="project-title">
                  <h3>{project.clientName}</h3>
                  <span className="project-type">{project.type}</span>
                </div>
                <div className="project-budget">${project.budget}</div>
              </div>

              <div className="project-progress-main">
                <div className="progress-label">
                  <span>Overall Progress</span>
                  <span>{Math.round(project.overallProgress)}%</span>
                </div>
                <div className="progress-bar-main">
                  <div
                    className="progress-fill-main"
                    style={{ width: `${project.overallProgress}%` }}
                  />
                </div>
              </div>

              <div className="tasks-section">
                <h4>Tasks:</h4>
                <div className="tasks-list">
                  {project.tasks.map((task) => {
                    const assignedEmployee = task.assignedEmployeeId
                      ? state.agency.employees.find((e) => e.id === task.assignedEmployeeId)
                      : null;

                    return (
                      <div key={task.id} className="task-item">
                        <div className="task-header">
                          <div className="task-info">
                            <span className="task-name">{task.name}</span>
                            <span className="task-status">{task.status}</span>
                          </div>
                          <span className="task-progress">{Math.round(task.progress)}%</span>
                        </div>

                        <div className="task-progress-bar">
                          <div
                            className="task-progress-fill"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>

                        <div className="task-assignment">
                          {assignedEmployee ? (
                            <div className="assigned-employee">
                              <span className="employee-avatar-small">
                                {assignedEmployee.avatar}
                              </span>
                              <span className="employee-name-small">
                                {assignedEmployee.name} {assignedEmployee.surname}
                              </span>
                            </div>
                          ) : (
                            <select
                              className="employee-select"
                              onChange={(e) =>
                                handleAssignEmployee(project.id, task.id, e.target.value)
                              }
                              value=""
                            >
                              <option value="">Assign Employee...</option>
                              {state.agency.employees
                                .filter((emp) => !emp.assignedTaskId && emp.deskId !== null)
                                .map((emp) => (
                                  <option key={emp.id} value={emp.id}>
                                    {emp.name} {emp.surname} ({emp.type})
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {completedProjects.length > 0 && (
        <div className="completed-section">
          <h3>✅ Completed Projects</h3>
          <div className="completed-list">
            {completedProjects.map((project) => (
              <div key={project.id} className="completed-project">
                <span>{project.clientName}</span>
                <span className="project-reward">+${project.budget}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPanel;
