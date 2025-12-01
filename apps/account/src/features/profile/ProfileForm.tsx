import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@mukulasoft/ui'
import { useAccount } from '../../context/account-context'

const profileSchema = z.object({
  displayName: z.string().min(2, 'Display name is required'),
  username: z.string().min(2, 'Username is required'),
  pronouns: z.string().min(2, 'Add pronouns to guide intros'),
  email: z.string().email('Use a valid email'),
  timezone: z.string().min(2),
  bio: z.string().min(10).max(280),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const ROLE_LIBRARY = [
  'Identity platform lead',
  'Pulse recommender research',
  'Creator relations',
  'Launch rituals',
]

const GENRE_LIBRARY = [
  'Downtempo',
  'Organic house',
  'Indietronica',
  'Ambient breaks',
  'Future soul',
]

export function ProfileForm() {
  const { profile, actions } = useAccount()
  const [roles, setRoles] = useState<string[]>(profile.focusRoles)
  const [genres, setGenres] = useState<string[]>(profile.preferredGenres)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile.displayName,
      username: profile.username,
      pronouns: profile.pronouns,
      email: profile.email,
      timezone: profile.timezone,
      bio: profile.bio,
    },
  })

  const watchedDisplayName = useWatch({ control, name: 'displayName' })
  const watchedUsername = useWatch({ control, name: 'username' })
  const watchedTimezone = useWatch({ control, name: 'timezone' })

  const toggleItem = (list: string[], value: string, setter: (value: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value])
  }

  const toggleRole = (value: string) => toggleItem(roles, value, setRoles)
  const toggleGenre = (value: string) => toggleItem(genres, value, setGenres)

  const onSubmit = async (values: ProfileFormValues) => {
    actions.updateProfile({ ...values, focusRoles: roles, preferredGenres: genres })
    setSavedAt(new Date().toLocaleTimeString())
    reset(values)
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <div>
          <h2>Profile & presence</h2>
          <p>
            Control what collaborators and recommendation services read from your identity graph.
          </p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </header>

      {savedAt ? <p className="panel__status">Last synced {savedAt}</p> : null}

      <form className="profile-grid" onSubmit={handleSubmit(onSubmit)}>
        <div className="profile-grid__form">
          <label>
            <span>Display name</span>
            <input type="text" {...register('displayName')} />
            {errors.displayName ? <small>{errors.displayName.message}</small> : null}
          </label>
          <label>
            <span>Username</span>
            <input type="text" {...register('username')} />
            {errors.username ? <small>{errors.username.message}</small> : null}
          </label>
          <label>
            <span>Pronouns</span>
            <input type="text" {...register('pronouns')} />
            {errors.pronouns ? <small>{errors.pronouns.message}</small> : null}
          </label>
          <label>
            <span>Contact email</span>
            <input type="email" {...register('email')} />
            {errors.email ? <small>{errors.email.message}</small> : null}
          </label>
          <label>
            <span>Timezone</span>
            <input type="text" {...register('timezone')} />
            {errors.timezone ? <small>{errors.timezone.message}</small> : null}
          </label>
          <label>
            <span>Bio</span>
            <textarea rows={4} {...register('bio')} />
            {errors.bio ? <small>{errors.bio.message}</small> : null}
          </label>

          <div>
            <span>Focus roles</span>
            <div className="pill-grid">
              {ROLE_LIBRARY.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={roles.includes(role) ? 'pill pill--active' : 'pill'}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span>Preferred genres</span>
            <div className="pill-grid">
              {GENRE_LIBRARY.map((genre) => (
                <button
                  type="button"
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={genres.includes(genre) ? 'pill pill--active' : 'pill'}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="profile-grid__preview">
          <div className="preview-card">
            <img src={profile.avatarUrl} alt="Profile avatar" />
            <div>
              <strong>{watchedDisplayName}</strong>
              <p>@{watchedUsername}</p>
            </div>
          </div>
          <dl>
            <div>
              <dt>Roles</dt>
              <dd>{roles.join(' · ') || 'Add at least one focus role'}</dd>
            </div>
            <div>
              <dt>Genres</dt>
              <dd>{genres.join(' · ') || 'Pick genres to guide the recommender'}</dd>
            </div>
            <div>
              <dt>Timezone</dt>
              <dd>{watchedTimezone}</dd>
            </div>
          </dl>
        </aside>
      </form>
    </section>
  )
}
