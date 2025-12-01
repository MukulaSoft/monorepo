import { Button, Badge } from '@mukulasoft/ui'
import { useAccount } from '../../context/account-context'

export function SecuritySettings() {
  const { security, actions } = useAccount()

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Security posture</h2>
          <p>Review authentication layers, passkeys, and recently active devices.</p>
        </div>
        <Button variant="ghost" onClick={() => actions.rotateBackupCodes()}>
          Rotate backup codes
        </Button>
      </header>

      <div className="security-grid">
        <article className="security-card">
          <div>
            <h3>Two-factor authentication</h3>
            <p>
              {security.twoFactorEnabled
                ? 'OTP app confirmed · minimal drift'
                : 'Protect sign-ins with a second factor'}
            </p>
          </div>
          <Button onClick={() => actions.setTwoFactor(!security.twoFactorEnabled)}>
            {security.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
          </Button>
        </article>

        <article className="security-card">
          <div>
            <h3>Passkey</h3>
            <p>
              {security.passkeyEnabled ? security.passkeyLabel : 'Register a device bound passkey.'}
            </p>
          </div>
          <Button variant="ghost" onClick={() => actions.registerPasskey('Studio MBP · Face ID')}>
            {security.passkeyEnabled ? 'Replace passkey' : 'Register passkey'}
          </Button>
        </article>

        <article className="security-card">
          <div>
            <h3>Backup codes</h3>
            <p>{security.backupCodesRemaining} single-use codes remaining.</p>
          </div>
          <Button variant="ghost" onClick={() => actions.rotateBackupCodes()}>
            Generate new set
          </Button>
        </article>

        <article className="security-card">
          <div>
            <h3>Login alerts</h3>
            <p>Receive notifications whenever a new device signs in.</p>
          </div>
          <Button variant="ghost" onClick={() => actions.toggleLoginAlerts(!security.loginAlerts)}>
            {security.loginAlerts ? 'Pause alerts' : 'Enable alerts'}
          </Button>
        </article>
      </div>

      <div className="security-table">
        <header>
          <div>
            <h3>Trusted devices</h3>
            <p>Revoke access for anything that looks off.</p>
          </div>
          <Badge tone="info" variant="soft">
            Password last rotated · {new Date(security.lastPasswordChange).toLocaleDateString()}
          </Badge>
        </header>
        <div className="security-table__grid">
          {security.devices.map((device) => (
            <div key={device.id} className="device-row">
              <div>
                <strong>{device.label}</strong>
                <p>{device.location}</p>
              </div>
              <div>
                <span
                  className={
                    device.trusted ? 'status-dot status-dot--ok' : 'status-dot status-dot--warn'
                  }
                />
                <small>Last active {new Date(device.lastActive).toLocaleString()}</small>
              </div>
              <Button
                variant="ghost"
                onClick={() => actions.setDeviceTrust(device.id, !device.trusted)}
              >
                {device.trusted ? 'Revoke trust' : 'Trust device'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
