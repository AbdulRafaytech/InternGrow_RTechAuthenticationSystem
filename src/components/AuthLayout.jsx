export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-story">
        <div className="brand">
          <span className="brand-mark" />
          RTech
        </div>

        <div className="story-quote">
          <h2>Build faster, ship with confidence.</h2>
          <p>
            RTech gives your team the tools to plan, build, and launch — all in one
            connected workspace.
          </p>
        </div>

        <div className="story-metrics">
          <div>
            <strong>8k+</strong>
            <span>Teams onboard</span>
          </div>
          <div>
            <strong>99.9%</strong>
            <span>Uptime</span>
          </div>
          <div>
            <strong>4.8/5</strong>
            <span>Avg. rating</span>
          </div>
        </div>
      </aside>

      <div className="auth-form-wrap">
        <div className="auth-card">{children}</div>
      </div>
    </div>
  );
}
