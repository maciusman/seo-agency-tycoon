import { useGame } from '../../state/context/GameContext';
import './EmployeesPanel.css';

const EmployeesPanel = () => {
  const { state, dispatch } = useGame();

  const handleHireEmployee = () => {
    // Generate a random employee for hire
    const names = ['Jan', 'Anna', 'Piotr', 'Maria', 'Tomasz', 'Karolina', 'Łukasz', 'Magdalena'];
    const surnames = ['Kowalski', 'Nowak', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński'];
    const types = ['junior', 'mid', 'senior'];
    const specializations = ['content', 'technical', 'linkBuilding', 'keywords', 'generalist'];

    const type = types[Math.floor(Math.random() * types.length)];
    const specialization = specializations[Math.floor(Math.random() * specializations.length)];

    const salaries = {
      junior: 800,
      mid: 1500,
      senior: 2500,
    };

    const hireCosts = {
      junior: 800,
      mid: 2000,
      senior: 5000,
    };

    const skillBase = {
      junior: 3,
      mid: 5,
      senior: 7,
    };

    const newEmployee = {
      name: names[Math.floor(Math.random() * names.length)],
      surname: surnames[Math.floor(Math.random() * surnames.length)],
      avatar: '👨‍💻',
      type,
      specialization,
      skills: {
        content: skillBase[type] + Math.floor(Math.random() * 3),
        technical: skillBase[type] + Math.floor(Math.random() * 3),
        linkBuilding: skillBase[type] + Math.floor(Math.random() * 3),
        keywords: skillBase[type] + Math.floor(Math.random() * 3),
        analytics: skillBase[type] + Math.floor(Math.random() * 3),
      },
      energy: 100,
      happiness: 70,
      loyalty: 60,
      experience: 0,
      salary: salaries[type],
      deskId: null,
      assignedProjectId: null,
      assignedTaskId: null,
      traits: [],
      workPreferences: {
        preferredHours: 'morning',
        needsCoffee: Math.random() > 0.5,
        prefersRemote: Math.random() > 0.7,
        teamPlayer: Math.random() > 0.5,
      },
      hireDate: state.gameDay,
      performanceHistory: [],
      completedProjects: 0,
    };

    dispatch({
      type: 'HIRE_EMPLOYEE',
      payload: {
        employee: newEmployee,
        hireCost: hireCosts[type],
      },
    });
  };

  const handleAssignToDesk = (employeeId) => {
    // Find first available desk
    const deskTileIndex = state.agency.tiles.findIndex(
      (tile) => tile.buildingType && tile.buildingType.startsWith('desk') && !state.agency.employees.find(e => e.deskId === state.agency.tiles.indexOf(tile))
    );

    if (deskTileIndex !== -1) {
      dispatch({
        type: 'ASSIGN_EMPLOYEE_TO_DESK',
        payload: { employeeId, deskTileIndex },
      });
    } else {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          message: 'No available desks! Build more desks first.',
          type: 'error',
        },
      });
    }
  };

  const handleSelectEmployee = (employeeId) => {
    dispatch({ type: 'SELECT_EMPLOYEE', payload: employeeId });
  };

  return (
    <div className="employees-panel">
      <div className="panel-header-main">
        <h2>👥 Employees Management</h2>
        <button className="btn-hire" onClick={handleHireEmployee}>
          + Hire Employee
        </button>
      </div>

      <div className="employees-grid">
        {state.agency.employees.length === 0 ? (
          <div className="empty-state">
            <p>No employees yet. Hire your first employee!</p>
          </div>
        ) : (
          state.agency.employees.map((employee) => (
            <div
              key={employee.id}
              className="employee-card"
              onClick={() => handleSelectEmployee(employee.id)}
            >
              <div className="employee-header">
                <span className="employee-avatar">{employee.avatar}</span>
                <div className="employee-name">
                  <div className="name-main">
                    {employee.name} {employee.surname}
                  </div>
                  <div className="name-sub">
                    {employee.type} • {employee.specialization}
                  </div>
                </div>
              </div>

              <div className="employee-stats">
                <div className="stat-bar">
                  <span className="stat-bar-label">Energy</span>
                  <div className="stat-bar-fill">
                    <div
                      className="stat-bar-progress energy"
                      style={{ width: `${employee.energy}%` }}
                    />
                  </div>
                  <span className="stat-bar-value">{Math.round(employee.energy)}%</span>
                </div>

                <div className="stat-bar">
                  <span className="stat-bar-label">Happy</span>
                  <div className="stat-bar-fill">
                    <div
                      className="stat-bar-progress happiness"
                      style={{ width: `${employee.happiness}%` }}
                    />
                  </div>
                  <span className="stat-bar-value">{Math.round(employee.happiness)}%</span>
                </div>
              </div>

              <div className="employee-info">
                <div className="info-item">
                  <span>Salary:</span>
                  <span>${employee.salary}/week</span>
                </div>
                <div className="info-item">
                  <span>Desk:</span>
                  <span>{employee.deskId !== null ? '✅ Assigned' : '❌ None'}</span>
                </div>
                <div className="info-item">
                  <span>Task:</span>
                  <span>{employee.assignedTaskId ? '📋 Working' : '💤 Idle'}</span>
                </div>
              </div>

              {employee.deskId === null && (
                <button
                  className="btn-assign-desk"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAssignToDesk(employee.id);
                  }}
                >
                  Assign to Desk
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeesPanel;
