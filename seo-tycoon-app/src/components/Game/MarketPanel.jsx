import { useGame } from '../../state/context/GameContext';
import './MarketPanel.css';

const MarketPanel = () => {
  const { state } = useGame();

  const { market, competitors, agency } = state;

  // Calculate total market
  const totalMarketShare = Object.values(market.marketShare).reduce((sum, share) => sum + share, 0);

  // Sort competitors by market share
  const sortedCompetitors = [...competitors].sort((a, b) => b.marketShare - a.marketShare);

  return (
    <div className="market-panel">
      <div className="market-header">
        <h2>📈 Market Analysis</h2>
        <div className="market-location">
          <span className="location-label">Location:</span>
          <span className="location-value">{agency.location.city}, {agency.location.country}</span>
        </div>
      </div>

      {/* Market Share Overview */}
      <section className="market-section">
        <h3>Market Share Distribution</h3>
        <div className="market-share-chart">
          {Object.entries(market.marketShare).map(([company, share]) => {
            const isPlayer = company === agency.name;
            const percentage = (share / totalMarketShare) * 100;

            return (
              <div key={company} className={`market-share-bar ${isPlayer ? 'player' : ''}`}>
                <div className="market-share-label">
                  <span className="company-name">{company}</span>
                  <span className="share-value">{share}%</span>
                </div>
                <div className="market-share-fill-container">
                  <div
                    className="market-share-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Competitor Analysis */}
      <section className="market-section">
        <h3>Competitor Analysis</h3>
        <div className="competitors-grid">
          {sortedCompetitors.map((competitor) => (
            <div key={competitor.id} className="competitor-card">
              <div className="competitor-header">
                <h4>{competitor.name}</h4>
                <span className={`strength-badge strength-${competitor.strength}`}>
                  ⭐ {competitor.strength}
                </span>
              </div>

              <div className="competitor-info">
                <div className="info-row">
                  <span className="info-label">📍 Location:</span>
                  <span className="info-value">{competitor.location}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">🎯 Specialization:</span>
                  <span className="info-value">{competitor.specialization}</span>
                </div>

                <div className="info-row">
                  <span className="info-label">📊 Strategy:</span>
                  <span className={`strategy-badge strategy-${competitor.strategy}`}>
                    {competitor.strategy}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">📈 Market Share:</span>
                  <span className="info-value">{competitor.marketShare}%</span>
                </div>

                <div className="info-row">
                  <span className="info-label">⭐ Reputation:</span>
                  <span className="info-value">{competitor.reputation}</span>
                </div>
              </div>

              {competitor.canBeAcquired && (
                <div className="acquisition-info">
                  <button className="acquisition-btn">
                    💰 Acquire for ${competitor.acquisitionPrice.toLocaleString()}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Player Stats */}
      <section className="market-section">
        <h3>Your Agency Performance</h3>
        <div className="player-stats">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Market Share</div>
              <div className="stat-value">{market.marketShare[agency.name]}%</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-label">Public Reputation</div>
              <div className="stat-value">{agency.reputation.public}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-label">Industry Reputation</div>
              <div className="stat-value">{agency.reputation.industry}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">😊</div>
            <div className="stat-content">
              <div className="stat-label">Client Satisfaction</div>
              <div className="stat-value">{agency.reputation.clientSatisfaction}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-content">
              <div className="stat-label">International Rep.</div>
              <div className="stat-value">{agency.reputation.international}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔒</div>
            <div className="stat-content">
              <div className="stat-label">Underground Rep.</div>
              <div className="stat-value">{agency.reputation.underground}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section className="market-section">
        <h3>Market Insights</h3>
        <div className="insights-container">
          <div className="insight-card">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <strong>Growth Opportunity:</strong> Local business SEO is trending up in your area.
              Consider specializing to capture more market share.
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">⚠️</div>
            <div className="insight-content">
              <strong>Competitive Threat:</strong> {sortedCompetitors[0]?.name} dominates with{' '}
              {sortedCompetitors[0]?.marketShare}% market share. Focus on differentiation.
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <div className="insight-content">
              <strong>Expansion Potential:</strong> Your reputation allows entry into premium markets.
              Consider targeting enterprise clients.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketPanel;
