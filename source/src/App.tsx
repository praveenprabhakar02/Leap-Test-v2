import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Apple,
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Bell,
  BellRing,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  Home,
  Info,
  Leaf,
  LineChart,
  MessageCircle,
  Moon,
  MoreHorizontal,
  RefreshCcw,
  Salad,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Target,
  TimerReset,
  UtensilsCrossed,
  Watch,
  X,
  Zap,
} from 'lucide-react'

type GoalId = 'energy' | 'sleep' | 'fitness'
type InsightId = 'screen-sleep' | 'food-workout' | 'movement-energy'
type AreaId =
  | 'sleep'
  | 'energy'
  | 'fitness'
  | 'nutrition'
  | 'stress'
  | 'mental'
  | 'biomarkers'
  | 'habits'
  | 'screen'
type WearableId = 'apple' | 'whoop' | 'oura' | 'garmin' | 'fitbit' | 'none'
type Route =
  | 'welcome'
  | 'goals'
  | 'areas'
  | 'wearables'
  | 'loading'
  | 'today'
  | 'brief'
  | 'focus'
  | 'area'
  | 'insights'
  | 'insight'
  | 'experiment-setup'
  | 'experiments'

type ProfileState = {
  goals: GoalId[]
  primaryGoal: GoalId
  areas: AreaId[]
  wearables: WearableId[]
}

const goalOptions: Array<{
  id: GoalId
  title: string
  description: string
  icon: typeof Zap
  disabled?: boolean
}> = [
  {
    id: 'energy',
    title: 'Have more energy',
    description: 'Feel steadier and more capable throughout the day.',
    icon: Zap,
  },
  {
    id: 'sleep',
    title: 'Improve overall health',
    description: 'Understand what supports your energy, sleep, recovery, and habits.',
    icon: HeartPulse,
  },
  {
    id: 'fitness',
    title: 'Improve fitness and body composition',
    description: 'Balance training, nutrition, movement, and recovery.',
    icon: Dumbbell,
    disabled: true,
  },
]

const areaOptions: Array<{
  id: AreaId
  label: string
  icon: typeof Moon
}> = [
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell },
  { id: 'nutrition', label: 'Nutrition', icon: Salad },
  { id: 'stress', label: 'Stress', icon: HeartPulse },
  { id: 'mental', label: 'Mental well-being', icon: Brain },
  { id: 'biomarkers', label: 'Biomarkers', icon: LineChart },
  { id: 'habits', label: 'Habits', icon: RefreshCcw },
  { id: 'screen', label: 'Screen time', icon: Smartphone },
]

const wearableOptions: Array<{
  id: WearableId
  label: string
  short: string
}> = [
  { id: 'apple', label: 'Apple Watch', short: 'AW' },
  { id: 'whoop', label: 'WHOOP', short: 'W' },
  { id: 'oura', label: 'Oura', short: 'O' },
  { id: 'garmin', label: 'Garmin', short: 'G' },
  { id: 'fitbit', label: 'Fitbit', short: 'F' },
]

const defaultProfile: ProfileState = {
  goals: ['energy'],
  primaryGoal: 'energy',
  areas: ['sleep', 'energy', 'nutrition', 'screen'],
  wearables: ['oura', 'apple'],
}

const goalMeta: Record<GoalId, { label: string; short: string }> = {
  energy: { label: 'Have more energy', short: 'Energy' },
  sleep: { label: 'Improve overall health', short: 'Health' },
  fitness: { label: 'Improve fitness and body composition', short: 'Fitness' },
}

const areaMeta: Record<AreaId, { label: string; icon: typeof Moon }> = Object.fromEntries(
  areaOptions.map((item) => [item.id, { label: item.label, icon: item.icon }]),
) as Record<AreaId, { label: string; icon: typeof Moon }>

const routeFromHash = (): Route => {
  const value = window.location.hash.replace('#/', '') as Route
  const valid: Route[] = [
    'welcome',
    'goals',
    'areas',
    'wearables',
    'loading',
    'today',
    'brief',
    'focus',
    'area',
    'insights',
    'insight',
    'experiment-setup',
    'experiments',
  ]
  return valid.includes(value) ? value : 'welcome'
}

function App() {
  const [route, setRoute] = useState<Route>(routeFromHash)
  const [profile, setProfile] = useState<ProfileState>(() => {
    const stored = localStorage.getItem('leap-profile')
    return stored ? (JSON.parse(stored) as ProfileState) : defaultProfile
  })
  const [selectedFocus, setSelectedFocus] = useState('meal')
  const [selectedArea, setSelectedArea] = useState<AreaId>('sleep')
  const [selectedInsight, setSelectedInsight] = useState<InsightId>('screen-sleep')
  const [activeExperimentInsight, setActiveExperimentInsight] = useState<InsightId>(
    () => (localStorage.getItem('leap-active-experiment-insight') as InsightId | null) ?? 'screen-sleep',
  )
  const [experimentStarted, setExperimentStarted] = useState(
    localStorage.getItem('leap-experiment-started') === 'true',
  )
  const [toast, setToast] = useState<string | null>(null)
  const [reminders, setReminders] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onHashChange)
    if (!window.location.hash) window.location.hash = '#/welcome'
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    localStorage.setItem('leap-profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

  const navigate = (next: Route) => {
    window.location.hash = `#/${next}`
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2400)
  }

  const resetDemo = () => {
    setProfile(defaultProfile)
    setExperimentStarted(false)
    setReminders({})
    localStorage.removeItem('leap-profile')
    localStorage.removeItem('leap-experiment-started')
    localStorage.removeItem('leap-active-experiment-insight')
    setActiveExperimentInsight('screen-sleep')
    navigate('welcome')
  }

  const openFocus = (id: string) => {
    setSelectedFocus(id)
    navigate('focus')
  }

  const openArea = (id: AreaId) => {
    setSelectedArea(id)
    navigate('area')
  }

  const openInsight = (id: InsightId) => {
    setSelectedInsight(id)
    navigate('insight')
  }

  const commonProps = { profile, setProfile, navigate }

  return (
    <div className="site-shell">
      <div className="phone-frame">
        {route === 'welcome' && <WelcomeScreen navigate={navigate} />}
        {route === 'goals' && <GoalsScreen {...commonProps} />}
        {route === 'areas' && <AreasScreen {...commonProps} />}
        {route === 'wearables' && <WearablesScreen {...commonProps} />}
        {route === 'loading' && <LoadingScreen profile={profile} navigate={navigate} />}
        {route === 'today' && (
          <TodayScreen
            profile={profile}
            openFocus={openFocus}
            openArea={openArea}
            openInsight={openInsight}
            navigate={navigate}
            reminders={reminders}
            setReminders={setReminders}
            showToast={showToast}
          />
        )}
        {route === 'brief' && <BriefDetail profile={profile} navigate={navigate} />}
        {route === 'focus' && (
          <FocusDetail
            profile={profile}
            focusId={selectedFocus}
            navigate={navigate}
            reminder={Boolean(reminders[selectedFocus])}
            toggleReminder={() => {
              setReminders((current) => ({ ...current, [selectedFocus]: !current[selectedFocus] }))
              showToast(
                reminders[selectedFocus]
                  ? 'Reminder removed'
                  : 'Demo reminder added. No real notification will be sent.',
              )
            }}
          />
        )}
        {route === 'area' && (
          <AreaDetail profile={profile} areaId={selectedArea} navigate={navigate} />
        )}
        {route === 'insights' && (
          <InsightsScreen profile={profile} openInsight={openInsight} navigate={navigate} />
        )}
        {route === 'insight' && (
          <InsightDetail
            profile={profile}
            insightId={selectedInsight}
            navigate={navigate}
          />
        )}
        {route === 'experiment-setup' && (
          <ExperimentSetup
            profile={profile}
            insightId={selectedInsight}
            navigate={navigate}
            startExperiment={() => {
              setExperimentStarted(true)
              setActiveExperimentInsight(selectedInsight)
              localStorage.setItem('leap-experiment-started', 'true')
              localStorage.setItem('leap-active-experiment-insight', selectedInsight)
              navigate('experiments')
            }}
          />
        )}
        {route === 'experiments' && (
          <ExperimentsScreen
            started={experimentStarted}
            insightId={activeExperimentInsight}
            navigate={navigate}
            showToast={showToast}
          />
        )}
        {route !== 'welcome' && route !== 'goals' && route !== 'areas' && route !== 'wearables' && route !== 'loading' && route !== 'brief' && route !== 'focus' && route !== 'area' && route !== 'insight' && route !== 'experiment-setup' && (
          <BottomNav route={route} navigate={navigate} />
        )}
        {toast && <div className="toast"><Check size={16} />{toast}</div>}
      </div>
      {route !== 'welcome' && (
        <button className="desktop-reset" onClick={resetDemo}>
          <RefreshCcw size={15} /> Reset demo
        </button>
      )}
    </div>
  )
}

function ScreenHeader({
  title,
  back,
  badge = true,
  action,
}: {
  title?: string
  back?: () => void
  badge?: boolean
  action?: React.ReactNode
}) {
  return (
    <header className="screen-header">
      <div className="header-side">
        {back ? (
          <button className="icon-button" aria-label="Go back" onClick={back}>
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="mini-logo-wordmark" aria-label="leap.">leap.</div>
        )}
      </div>
      <div className="header-center">
        {title && <span className="header-title">{title}</span>}
        {badge && <span className="demo-badge">Demo profile</span>}
      </div>
      <div className="header-side header-right">{action}</div>
    </header>
  )
}

function WelcomeScreen({ navigate }: { navigate: (route: Route) => void }) {
  return (
    <main className="welcome-screen">
      <div className="welcome-orbit" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit-center"><Sparkles size={32} strokeWidth={1.7} /></div>
        <div className="orbit-node node-one"><Moon size={19} /></div>
        <div className="orbit-node node-two"><Activity size={19} /></div>
        <div className="orbit-node node-three"><Salad size={19} /></div>
        <div className="orbit-node node-four"><Smartphone size={19} /></div>
      </div>
      <div className="welcome-copy">
        <div className="brand-lockup" aria-label="leap.">leap.</div>
        <p className="eyebrow">YOUR PERSONAL HEALTH OS</p>
        <h1>Understand what your health is telling you.</h1>
        <p className="welcome-subhead">
          Your health is connected. Your apps are not. Leap brings your information together and helps you understand what to do next.
        </p>
      </div>
      <div className="welcome-actions">
        <button className="primary-button" onClick={() => navigate('goals')}>
          Try a demo profile <ArrowRight size={18} />
        </button>
        <div className="privacy-note">
          <ShieldCheck size={17} />
          <span>No account or personal health information required. This experience uses fictional sample data.</span>
        </div>
      </div>
    </main>
  )
}

function OnboardingShell({
  step,
  title,
  description,
  children,
  canContinue,
  nextLabel = 'Continue',
  onNext,
  onBack,
}: {
  step: number
  title: string
  description: string
  children: React.ReactNode
  canContinue: boolean
  nextLabel?: string
  onNext: () => void
  onBack: () => void
}) {
  return (
    <main className="onboarding-screen">
      <ScreenHeader back={onBack} badge={false} />
      <div className="progress-row">
        {[1, 2, 3].map((item) => (
          <div key={item} className={`progress-segment ${item <= step ? 'active' : ''}`} />
        ))}
      </div>
      <div className="onboarding-heading">
        <span className="step-label">STEP {step} OF 3</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="onboarding-content">{children}</div>
      <div className="sticky-action">
        <button className="primary-button" disabled={!canContinue} onClick={onNext}>
          {nextLabel} <ArrowRight size={18} />
        </button>
      </div>
    </main>
  )
}

function GoalsScreen({
  profile,
  setProfile,
  navigate,
}: {
  profile: ProfileState
  setProfile: React.Dispatch<React.SetStateAction<ProfileState>>
  navigate: (route: Route) => void
}) {
  const toggleGoal = (id: GoalId) => {
    setProfile((current) => {
      const exists = current.goals.includes(id)
      const goals = exists ? current.goals.filter((goal) => goal !== id) : [...current.goals, id]
      const primaryGoal = !goals.includes(current.primaryGoal) ? goals[0] ?? 'energy' : current.primaryGoal
      return { ...current, goals, primaryGoal }
    })
  }

  return (
    <OnboardingShell
      step={1}
      title="What would you like Leap to help with?"
      description="Choose one or more. Your primary goal will shape what Leap shows first."
      canContinue={profile.goals.length > 0}
      onNext={() => navigate('areas')}
      onBack={() => navigate('welcome')}
    >
      <div className="selection-stack">
        {goalOptions.map((goal) => {
          const selected = profile.goals.includes(goal.id)
          const primary = profile.primaryGoal === goal.id && selected
          const Icon = goal.icon
          return (
            <div key={goal.id} className={`goal-card ${selected ? 'selected' : ''} ${goal.disabled ? 'disabled' : ''}`}>
              <button className="goal-main" disabled={goal.disabled} onClick={() => toggleGoal(goal.id)}>
                <span className="selection-icon"><Icon size={21} /></span>
                <span className="goal-text">
                  <strong>{goal.title}</strong>
                  <small>{goal.description}</small>
                </span>
                <span className={`check-control ${selected ? 'checked' : ''}`}>
                  {selected && <Check size={15} />}
                </span>
              </button>
              {selected && (
                <button
                  className={`primary-goal-control ${primary ? 'is-primary' : ''}`}
                  onClick={() => setProfile((current) => ({ ...current, primaryGoal: goal.id }))}
                >
                  {primary ? <><Target size={14} /> Primary goal</> : 'Make primary'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </OnboardingShell>
  )
}

function AreasScreen({
  profile,
  setProfile,
  navigate,
}: {
  profile: ProfileState
  setProfile: React.Dispatch<React.SetStateAction<ProfileState>>
  navigate: (route: Route) => void
}) {
  const toggleArea = (id: AreaId) => {
    setProfile((current) => ({
      ...current,
      areas: current.areas.includes(id)
        ? current.areas.filter((area) => area !== id)
        : [...current.areas, id],
    }))
  }

  return (
    <OnboardingShell
      step={2}
      title="What should Leap pay the most attention to?"
      description="Choose 3–5 areas. You will still be able to see everything else."
      canContinue={profile.areas.length > 0}
      onNext={() => navigate('wearables')}
      onBack={() => navigate('goals')}
    >
      <div className="selection-summary-row">
        <span>{profile.areas.length} selected</span>
        <button
          onClick={() =>
            setProfile((current) => ({
              ...current,
              areas: current.areas.length === areaOptions.length ? [] : areaOptions.map((area) => area.id),
            }))
          }
        >
          {profile.areas.length === areaOptions.length ? 'Clear all' : 'Select all'}
        </button>
      </div>
      <div className="area-grid">
        {areaOptions.map((area) => {
          const selected = profile.areas.includes(area.id)
          const Icon = area.icon
          return (
            <button
              key={area.id}
              className={`area-choice ${selected ? 'selected' : ''}`}
              onClick={() => toggleArea(area.id)}
            >
              <span className="area-choice-icon"><Icon size={20} /></span>
              <span>{area.label}</span>
              <span className={`check-control ${selected ? 'checked' : ''}`}>
                {selected && <Check size={14} />}
              </span>
            </button>
          )
        })}
      </div>
    </OnboardingShell>
  )
}

function WearablesScreen({
  profile,
  setProfile,
  navigate,
}: {
  profile: ProfileState
  setProfile: React.Dispatch<React.SetStateAction<ProfileState>>
  navigate: (route: Route) => void
}) {
  const toggleWearable = (id: WearableId) => {
    setProfile((current) => {
      if (id === 'none') return { ...current, wearables: current.wearables.includes('none') ? [] : ['none'] }
      const withoutNone = current.wearables.filter((wearable) => wearable !== 'none')
      return {
        ...current,
        wearables: withoutNone.includes(id)
          ? withoutNone.filter((wearable) => wearable !== id)
          : [...withoutNone, id],
      }
    })
  }

  return (
    <OnboardingShell
      step={3}
      title="Which wearable do you use?"
      description="Choose all that apply. Nothing will be connected during this demo."
      canContinue={profile.wearables.length > 0}
      nextLabel="Load my demo"
      onNext={() => navigate('loading')}
      onBack={() => navigate('areas')}
    >
      <div className="wearable-grid">
        {wearableOptions.map((wearable) => {
          const selected = profile.wearables.includes(wearable.id)
          return (
            <button
              key={wearable.id}
              className={`wearable-choice ${selected ? 'selected' : ''} ${wearable.id === 'none' ? 'wide' : ''}`}
              onClick={() => toggleWearable(wearable.id)}
            >
              <span className="wearable-logo">{wearable.id === 'apple' ? <Apple size={21} /> : wearable.short}</span>
              <span>{wearable.label}</span>
              {selected && <span className="wearable-check"><Check size={13} /></span>}
            </button>
          )
        })}
      </div>
      <div className="research-note"><Info size={16} /> Your answer helps us understand which devices people use. It is stored only in this browser.</div>
    </OnboardingShell>
  )
}

function LoadingScreen({ profile, navigate }: { profile: ProfileState; navigate: (route: Route) => void }) {
  const [step, setStep] = useState(0)
  const deviceText = profile.wearables.includes('none')
    ? 'sample health data'
    : profile.wearables.map((id) => wearableOptions.find((item) => item.id === id)?.label).filter(Boolean).join(' + ')
  const steps = [
    `Prioritizing ${goalMeta[profile.primaryGoal].short.toLowerCase()}`,
    `Organizing ${profile.areas.length} health areas`,
    `Adding ${deviceText}`,
    'Finding useful connections',
  ]

  useEffect(() => {
    const interval = window.setInterval(() => setStep((current) => Math.min(current + 1, steps.length - 1)), 650)
    const timeout = window.setTimeout(() => navigate('today'), 3150)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [])

  return (
    <main className="loading-screen">
      <div className="loading-visual">
        <div className="loading-pulse pulse-a" />
        <div className="loading-pulse pulse-b" />
        <div className="loading-core"><Sparkles size={30} /></div>
      </div>
      <div className="loading-copy">
        <span className="demo-badge">Fictional sample data</span>
        <h1>Creating your sample Health OS</h1>
        <p>We are shaping the demo around the goals, areas, and devices you selected.</p>
      </div>
      <div className="loading-steps">
        {steps.map((label, index) => (
          <div key={label} className={`loading-step ${index <= step ? 'complete' : ''}`}>
            <span className="loading-step-icon">{index < step ? <Check size={14} /> : index === step ? <span className="spinner" /> : null}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </main>
  )
}

function getSources(profile: ProfileState) {
  const selected = profile.wearables.filter((id) => id !== 'none')
  const primaryDevice = selected[0] ?? 'oura'
  const secondaryDevice = selected[1] ?? selected[0] ?? 'apple'
  const label = (id: WearableId) => wearableOptions.find((item) => item.id === id)?.label ?? 'Sample wearable'
  return {
    sleep: `${label(primaryDevice)} · sample`,
    activity: `${label(secondaryDevice)} · sample`,
    recovery: `${label(primaryDevice)} · sample`,
  }
}

function getPersonalizedContent(profile: ProfileState) {
  const primary = profile.primaryGoal
  const content = {
    energy: {
      title: 'Your energy may feel lower today',
      brief: 'You slept less than usual after a high-activity day, and your first meal has recently been later than normal. A lighter start with consistent food and movement may help you feel steadier today.',
      opportunity: 'Your biggest opportunity today is recovery',
      opportunityCopy: 'You slept 5 hours 48 minutes following a higher-than-usual activity day.',
      goalReason: 'to support more consistent energy',
      focusOrder: ['meal', 'walk', 'screen'],
      insightOrder: ['movement-energy', 'screen-sleep', 'food-workout'],
      evidence: [
        ['Sleep', '5h 48m', 'Shorter than your recent average'],
        ['Activity load', 'High', 'Yesterday was 22% above average'],
        ['First meal', '11:42 a.m.', 'Trending later than usual'],
        ['Energy check-in', '6 / 10', 'Slightly below your norm'],
      ],
      interpretation: 'Leap connected shorter sleep, higher activity load, later fueling, and a lower morning check-in. The most relevant next step is a steadier recovery day, not a harder push.',
      sources: ['Sleep data', 'Activity data', 'Sample nutrition log', 'Daily energy check-ins'],
    },
    sleep: {
      title: 'Your overall health signals need an easier day',
      brief: 'Shorter sleep, later meal timing, and yesterday’s higher activity load are all pointing in the same direction. A steadier day with earlier food, light movement, and a cleaner wind-down may help your body reset.',
      opportunity: 'Your biggest opportunity today is recovery rhythm',
      opportunityCopy: 'Sleep, fueling, and activity load are the signals most out of pattern today.',
      goalReason: 'to support overall health',
      focusOrder: ['meal', 'walk', 'screen'],
      insightOrder: ['movement-energy', 'screen-sleep', 'food-workout'],
      evidence: [
        ['Sleep', '5h 48m', 'Below your recent pattern'],
        ['Meal timing', '11:42 a.m.', 'First meal has been drifting later'],
        ['Activity load', 'High', 'Yesterday was above your usual range'],
        ['Recovery rhythm', 'Uneven', 'Sleep, food, and movement are not aligned today'],
      ],
      interpretation: 'Leap is treating this as an overall-health day because several basic rhythms are off at the same time: sleep, fueling, and load. The recommended actions are meant to make today steadier.',
      sources: ['Sleep data', 'Sample nutrition log', 'Activity data', 'Daily check-ins'],
    },
    fitness: {
      title: 'Today is better suited to recovery than intensity',
      brief: 'Yesterday’s activity was high, sleep was shorter than usual, and recent meal timing has been inconsistent. Fueling early and choosing moderate movement may support your next quality training session.',
      opportunity: 'Your biggest opportunity today is training readiness',
      opportunityCopy: 'Recovery signals are moderate after a high-load day and 5 hours 48 minutes of sleep.',
      goalReason: 'to support sustainable fitness progress',
      focusOrder: ['meal', 'walk', 'screen'],
      insightOrder: ['food-workout', 'screen-sleep', 'movement-energy'],
      evidence: [
        ['Activity load', 'High', 'Yesterday was above your usual range'],
        ['Sleep', '5h 48m', 'Shorter than your recent average'],
        ['Fueling', 'Later first meal', 'Recent timing has been inconsistent'],
        ['Training direction', 'Moderate', 'Recovery-first movement fits today'],
      ],
      interpretation: 'Leap is prioritizing training readiness today because high load plus shorter sleep can make another hard effort less useful. Food timing and moderate movement are the most relevant levers.',
      sources: ['Activity data', 'Sleep data', 'Sample nutrition log', 'Daily check-ins'],
    },
  }[primary]
  return content
}

const focusLibrary = {
  meal: {
    title: 'Eat a substantial meal before 11 a.m.',
    short: 'Earlier fuel',
    description: 'Include protein, carbohydrates, and something high in fibre.',
    time: '10:30 a.m.',
    icon: UtensilsCrossed,
    evidence: [
      'Your first meal was after 11:30 a.m. on four of the last six days.',
      'Your afternoon energy was lower on three of those days.',
      'Yesterday’s activity was higher than your usual level.',
    ],
    why: 'Eating earlier after a high-activity day may give you a more consistent source of energy.',
    sources: ['Sample nutrition log', 'Activity data', 'Daily energy check-ins'],
  },
  walk: {
    title: 'Walk for at least 20 minutes before 3 p.m.',
    short: 'Earlier movement',
    description: 'Your energy check-ins have generally been better on days with earlier movement.',
    time: '2:15 p.m.',
    icon: Footprints,
    evidence: [
      'You reported higher afternoon energy on six of eight days when you walked before noon.',
      'Today’s recovery signals suggest moderate movement rather than intense training.',
      'Your movement is currently below your usual pace for this time of day.',
    ],
    why: 'A short, easy walk can add movement without placing much additional demand on recovery.',
    sources: ['Activity data', 'Recovery trend', 'Daily energy check-ins'],
  },
  screen: {
    title: 'Finish screen use 30 minutes before bed.',
    short: 'Earlier wind-down',
    description: 'Late screen use has recently coincided with later sleep.',
    time: '10:15 p.m.',
    icon: Smartphone,
    evidence: [
      'Screen use continued past 11 p.m. on five of the last six late-sleep nights.',
      'You slept an average of 42 minutes less on those nights.',
      'Your bedtime was 54 minutes later than usual last night.',
    ],
    why: 'A consistent stopping point gives you a simple behaviour to test against sleep timing and duration.',
    sources: ['Phone Screen Time', 'Sleep data', 'Daily check-ins'],
  },
}

function TodayScreen({
  profile,
  openFocus,
  openArea,
  openInsight,
  navigate,
  reminders,
  setReminders,
  showToast,
}: {
  profile: ProfileState
  openFocus: (id: string) => void
  openArea: (id: AreaId) => void
  openInsight: (id: InsightId) => void
  navigate: (route: Route) => void
  reminders: Record<string, boolean>
  setReminders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  showToast: (message: string) => void
}) {
  const content = getPersonalizedContent(profile)
  const sources = getSources(profile)
  const areas = useMemo(() => getAreaCards(profile), [profile])
  const previewInsight = getInsights(profile)[0]
  const selectedLabels = profile.areas.slice(0, 3).map((id) => areaMeta[id].label.toLowerCase()).join(', ')

  return (
    <main className="app-screen has-nav">
      <ScreenHeader action={<button className="avatar-button">M</button>} />
      <section className="today-intro padded">
        <div>
          <p className="morning-label">GOOD MORNING</p>
          <h1>Maya</h1>
        </div>
        <div className="goal-pill"><Target size={14} /> {goalMeta[profile.primaryGoal].label}</div>
      </section>
      <section className="daily-brief padded">
        <div className="brief-topline"><span>YOUR DAILY BRIEF</span><Sparkles size={17} /></div>
        <h2>{content.title}</h2>
        <p>{content.brief}</p>
        <div className="source-chips">
          <span><Moon size={13} /> {sources.sleep.replace(' · sample', '')}</span>
          <span><Activity size={13} /> {sources.activity.replace(' · sample', '')}</span>
          <span><Salad size={13} /> Food log</span>
          <span><Zap size={13} /> Check-in</span>
        </div>
        <button className="text-button light" onClick={() => navigate('brief')}>
          See how Leap reached this <ArrowRight size={15} />
        </button>
      </section>

      <section className="section padded">
        <div className="section-heading">
          <div><span className="section-kicker">DO THESE NEXT</span><h2>Your current focus</h2></div>
          <span className="count-badge">3</span>
        </div>
        <div className="focus-list">
          {content.focusOrder.map((id, index) => {
            const item = focusLibrary[id as keyof typeof focusLibrary]
            const Icon = item.icon
            return (
              <article className="focus-card" key={id}>
                <div className="focus-number">{index + 1}</div>
                <div className="focus-body">
                  <div className="focus-icon"><Icon size={19} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="focus-actions">
                    <button onClick={() => openFocus(id)}>Why this? <ChevronRight size={15} /></button>
                    <button
                      className={reminders[id] ? 'reminder-active' : ''}
                      onClick={() => {
                        setReminders((current) => ({ ...current, [id]: !current[id] }))
                        showToast(reminders[id] ? 'Reminder removed' : `Demo reminder added for ${item.time}`)
                      }}
                    >
                      {reminders[id] ? <BellRing size={15} /> : <Bell size={15} />}
                      {reminders[id] ? item.time : 'Remind me'}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="section padded">
        <div className="section-heading">
          <div><span className="section-kicker">ONE THING TO KNOW</span><h2>What matters today</h2></div>
        </div>
        <button className="opportunity-card" onClick={() => openArea(profile.primaryGoal === 'sleep' ? 'sleep' : 'energy')}>
          <div className="opportunity-icon"><BatteryCharging size={24} /></div>
          <div>
            <strong>{content.opportunity}</strong>
            <p>{content.opportunityCopy}</p>
            <span>View details <ArrowRight size={14} /></span>
          </div>
        </button>
      </section>

      <section className="section padded">
        <div className="section-heading">
          <div><span className="section-kicker">AT A GLANCE</span><h2>How you are doing</h2></div>
        </div>
        <p className="personalization-note"><Sparkles size={14} /> Prioritized around {selectedLabels || 'your selected areas'} and what needs attention.</p>
        <div className="status-grid">
          {areas.slice(0, 6).map((area) => {
            const Icon = area.icon
            return (
              <button key={area.id} className="status-card" onClick={() => openArea(area.id)}>
                <div className="status-card-top"><span className="status-icon"><Icon size={18} /></span><ChevronRight size={15} /></div>
                <strong>{area.label}</strong>
                <span className={`status-value tone-${area.tone}`}>{area.status}</span>
                <small>{area.detail}</small>
              </button>
            )
          })}
        </div>
      </section>

      <section className="section padded insight-preview-section">
        <div className="section-heading">
          <div><span className="section-kicker">A PATTERN WORTH TESTING</span><h2>Leap noticed</h2></div>
          <button className="see-all" onClick={() => navigate('insights')}>See all</button>
        </div>
        <InsightCard insight={previewInsight} onClick={() => openInsight(previewInsight.id)} featured />
      </section>

      <section className="data-footer padded">
        <div className="data-footer-icon"><ShieldCheck size={20} /></div>
        <div><strong>Built from your selected demo sources</strong><p>Every suggestion shows the sample information Leap used. Nothing here is medical advice.</p></div>
      </section>
    </main>
  )
}

function getAreaCards(profile: ProfileState) {
  const source = getSources(profile)
  const cards: Array<{ id: AreaId; label: string; status: string; detail: string; tone: string; icon: typeof Moon; priority: number }> = [
    { id: 'sleep', label: 'Sleep', status: 'Needs attention', detail: '5h 48m last night', tone: 'attention', icon: Moon, priority: 2 },
    { id: 'energy', label: 'Energy', status: 'Likely lower', detail: 'Based on 4 signals', tone: 'attention', icon: Zap, priority: 1 },
    { id: 'fitness', label: 'Movement', status: 'On track', detail: 'Moderate day suggested', tone: 'good', icon: Footprints, priority: 5 },
    { id: 'biomarkers', label: 'Recovery', status: 'Moderate', detail: source.recovery.replace(' · sample', ''), tone: 'medium', icon: HeartPulse, priority: 3 },
    { id: 'nutrition', label: 'Nutrition', status: 'Inconsistent', detail: 'First meal trending later', tone: 'medium', icon: Salad, priority: 4 },
    { id: 'screen', label: 'Screen time', status: 'Worth watching', detail: 'Past 11 p.m. last night', tone: 'medium', icon: Smartphone, priority: 6 },
    { id: 'stress', label: 'Stress', status: 'Stable', detail: 'Near recent average', tone: 'good', icon: Activity, priority: 7 },
    { id: 'mental', label: 'Well-being', status: 'Steady', detail: 'Mood check-in: 7/10', tone: 'good', icon: Brain, priority: 8 },
    { id: 'habits', label: 'Habits', status: 'Building', detail: '4-day morning streak', tone: 'good', icon: RefreshCcw, priority: 9 },
  ]
  const goalPriority: Record<GoalId, AreaId[]> = {
    energy: ['energy', 'sleep', 'nutrition', 'screen', 'fitness'],
    sleep: ['sleep', 'energy', 'nutrition', 'biomarkers', 'screen'],
    fitness: ['fitness', 'biomarkers', 'nutrition', 'sleep', 'energy'],
  }
  return cards.sort((a, b) => {
    const goalA = goalPriority[profile.primaryGoal].indexOf(a.id)
    const goalB = goalPriority[profile.primaryGoal].indexOf(b.id)
    const selectedA = profile.areas.includes(a.id) ? 0 : 1
    const selectedB = profile.areas.includes(b.id) ? 0 : 1
    return selectedA - selectedB || (goalA === -1 ? 99 : goalA) - (goalB === -1 ? 99 : goalB) || a.priority - b.priority
  })
}

function BriefDetail({ profile, navigate }: { profile: ProfileState; navigate: (route: Route) => void }) {
  const content = getPersonalizedContent(profile)
  const sources = getSources(profile)
  const sourceLabels = content.sources.map((source) => {
    if (source === 'Activity data') return sources.activity
    if (source === 'Sleep data') return sources.sleep
    return source
  })

  return (
    <main className="detail-screen">
      <ScreenHeader title="Daily brief" back={() => navigate('today')} />
      <div className="detail-hero padded">
        <span className="detail-icon"><Sparkles size={25} /></span>
        <span className="section-kicker">HOW LEAP REACHED THIS</span>
        <h1>{content.title}</h1>
        <p>{content.brief}</p>
        <div className="goal-link"><Target size={15} /> Prioritized for {goalMeta[profile.primaryGoal].label.toLowerCase()}.</div>
      </div>
      <div className="detail-content padded">
        <section className="metric-panel">
          <span className="section-kicker">SIGNALS USED</span>
          {content.evidence.map(([label, value, note]) => (
            <div className="metric-row" key={label}><span>{label}</span><div><strong>{value}</strong><small>{note}</small></div></div>
          ))}
        </section>
        <section className="connection-card">
          <div className="connection-card-icon"><Sparkles size={19} /></div>
          <div><span className="section-kicker">LEAP'S INTERPRETATION</span><p>{content.interpretation}</p></div>
        </section>
        <section className="explain-section">
          <h2>Where this came from</h2>
          <div className="source-list">
            {sourceLabels.map((source) => <span key={source}><Check size={14} /> {source}</span>)}
          </div>
        </section>
        <div className="association-note"><CircleHelp size={18} /><p>This is a demo explanation based on fictional sample data. It shows associations, not medical conclusions.</p></div>
      </div>
    </main>
  )
}

function FocusDetail({
  profile,
  focusId,
  navigate,
  reminder,
  toggleReminder,
}: {
  profile: ProfileState
  focusId: string
  navigate: (route: Route) => void
  reminder: boolean
  toggleReminder: () => void
}) {
  const item = focusLibrary[focusId as keyof typeof focusLibrary] ?? focusLibrary.meal
  const sources = getSources(profile)
  const sourceLabels = item.sources.map((source) => {
    if (source === 'Activity data') return sources.activity
    if (source === 'Sleep data') return sources.sleep
    if (source === 'Recovery trend') return sources.recovery
    return source
  })
  return (
    <main className="detail-screen">
      <ScreenHeader title="Why this today" back={() => navigate('today')} />
      <div className="detail-hero padded">
        <span className="detail-icon"><item.icon size={25} /></span>
        <span className="section-kicker">PERSONALIZED RECOMMENDATION</span>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <div className="goal-link"><Target size={15} /> Selected {goalMeta[profile.primaryGoal].short.toLowerCase()} as your primary goal.</div>
      </div>
      <div className="detail-content padded">
        <section className="explain-section">
          <h2>What Leap used</h2>
          <div className="evidence-list">
            {item.evidence.map((evidence, index) => (
              <div key={evidence}><span>{index + 1}</span><p>{evidence}</p></div>
            ))}
          </div>
        </section>
        <section className="explain-section">
          <h2>Why it may help</h2>
          <p>{item.why} Leap prioritized this {getPersonalizedContent(profile).goalReason}.</p>
        </section>
        <section className="explain-section">
          <h2>Information sources</h2>
          <div className="source-list">
            {sourceLabels.map((source) => <span key={source}><Check size={14} /> {source}</span>)}
          </div>
        </section>
        <div className="association-note"><CircleHelp size={18} /><p>Leap has noticed an association in the sample data. It does not prove that one factor caused another.</p></div>
      </div>
      <div className="sticky-action detail-sticky">
        <button className={`primary-button ${reminder ? 'success-button' : ''}`} onClick={toggleReminder}>
          {reminder ? <><Check size={18} /> Reminder set for {item.time}</> : <><Bell size={18} /> Remind me at {item.time}</>}
        </button>
      </div>
    </main>
  )
}

function AreaDetail({ profile, areaId, navigate }: { profile: ProfileState; areaId: AreaId; navigate: (route: Route) => void }) {
  const area = getAreaCards(profile).find((item) => item.id === areaId) ?? getAreaCards(profile)[0]
  const Icon = area.icon
  const sources = getSources(profile)
  const contentByArea: Partial<Record<AreaId, { summary: string; metrics: Array<[string, string, string]>; observation: string; sources: string[] }>> = {
    sleep: {
      summary: 'You slept less than usual and went to bed later than your recent pattern.',
      metrics: [['Duration', '5h 48m', '1h 07m below average'], ['Bedtime', '12:18 a.m.', '54m later than usual'], ['Consistency', 'Lower', '3 of 7 nights on time']],
      observation: 'Late phone use and a high-activity day both overlap with last night’s shorter sleep.',
      sources: [sources.sleep, 'Phone Screen Time', 'Fictional daily check-in'],
    },
    energy: {
      summary: 'Four connected signals suggest your energy may be less stable today.',
      metrics: [['Morning check-in', '6 / 10', 'Slightly below usual'], ['Sleep', '5h 48m', 'Shorter than average'], ['First meal trend', '11:42 a.m.', 'Trending later']],
      observation: 'Earlier food and easy movement are the most practical things to test today.',
      sources: ['Daily energy check-ins', sources.sleep, 'Sample nutrition log', sources.activity],
    },
    nutrition: {
      summary: 'Your meal timing has been less consistent over the last week.',
      metrics: [['First meal', '11:42 a.m.', '52m later than usual'], ['Protein consistency', '4 of 7 days', 'Below your recent target'], ['Last meal', '8:48 p.m.', 'Near usual']],
      observation: 'Later first meals have overlapped with lower afternoon energy in the sample profile.',
      sources: ['Sample nutrition log', 'Daily energy check-ins'],
    },
    screen: {
      summary: 'Evening screen use has recently continued closer to sleep.',
      metrics: [['After 11 p.m.', '5 of 6 nights', 'Higher than usual'], ['Last phone use', '11:56 p.m.', '22m before sleep'], ['Evening total', '2h 18m', '31m above average']],
      observation: 'This is an early pattern, not proof. A seven-day experiment could make it more useful.',
      sources: ['Phone Screen Time', sources.sleep],
    },
    fitness: {
      summary: 'Yesterday was a higher-load day, so moderate movement fits today’s recovery state.',
      metrics: [['Activity load', 'High', '22% above average'], ['Active minutes', '74 min', '18m above average'], ['Today’s direction', 'Moderate', 'Recovery-first']],
      observation: 'A 20-minute walk would keep momentum without adding much recovery demand.',
      sources: [sources.activity, sources.recovery, 'Daily energy check-ins'],
    },
    biomarkers: {
      summary: 'Recovery-related trends are moderate rather than alarming.',
      metrics: [['HRV trend', 'Down slightly', 'Relative to 14-day range'], ['Resting heart rate', '+3 bpm', 'Above recent baseline'], ['Recovery direction', 'Moderate', 'Use context, not one number']],
      observation: 'Leap considers trends together with sleep and activity instead of treating one metric as a verdict.',
      sources: [sources.recovery, sources.sleep, sources.activity],
    },
  }
  const content = contentByArea[areaId] ?? {
    summary: 'This area is close to your recent pattern and does not require much attention today.',
    metrics: [['Today', area.status, area.detail], ['Recent pattern', 'Stable', 'No major change'], ['Priority', 'Lower', 'Other areas matter more today']],
    observation: 'Leap still keeps this area visible while prioritizing the signals most connected to your goal.',
    sources: ['Fictional daily check-in', 'Selected demo sources'],
  }
  return (
    <main className="detail-screen area-detail-screen">
      <ScreenHeader title={area.label} back={() => navigate('today')} />
      <div className="area-detail-hero padded">
        <div className="area-hero-title"><span className="large-area-icon"><Icon size={26} /></span><div><span className={`status-value tone-${area.tone}`}>{area.status}</span><h1>{area.label}</h1></div></div>
        <p>{content.summary}</p>
      </div>
      <div className="detail-content padded">
        <section className="metric-panel">
          <span className="section-kicker">UNDER THE SUMMARY</span>
          {content.metrics.map(([label, value, note]) => (
            <div className="metric-row" key={label}><span>{label}</span><div><strong>{value}</strong><small>{note}</small></div></div>
          ))}
        </section>
        <section className="connection-card">
          <div className="connection-card-icon"><Sparkles size={19} /></div>
          <div><span className="section-kicker">LEAP'S INTERPRETATION</span><p>{content.observation}</p></div>
        </section>
        <section className="explain-section">
          <h2>Where this came from</h2>
          <div className="source-list">
            {content.sources.map((source) => <span key={source}><Check size={14} /> {source}</span>)}
          </div>
        </section>
      </div>
    </main>
  )
}

type Insight = {
  id: InsightId
  title: string
  summary: string
  tags: string[]
  confidence: string
  icon: typeof Smartphone
  noticed: string
  matters: Record<GoalId, string>
  tryText: string
  dataPoints: Array<{ date: string; signal: string; outcome: string }>
  experiment: ExperimentConfig
}

type ExperimentConfig = {
  title: string
  description: string
  plan: string[]
  evaluate: Array<{ label: string; icon: typeof Clock3 }>
  baseline: { label: string; value: string; detail: string }
  target: { label: string; value: string; detail: string }
  activeTitle: string
  activeDescription: string
  tonightTarget: string
  reminderTime: string
  reminderToast: string
}

const insightLibrary: Insight[] = [
  {
    id: 'screen-sleep',
    title: 'Late screen use may be affecting your sleep',
    summary: 'On five of the last six nights when screen use continued past 11 p.m., you fell asleep later and slept an average of 42 minutes less.',
    tags: ['Screen time', 'Sleep'],
    confidence: 'Moderate confidence',
    icon: Smartphone,
    noticed: 'Late phone use repeatedly overlapped with later sleep and shorter sleep duration in the sample profile.',
    matters: {
      energy: 'More consistent evening screen habits may support better sleep, which may help your energy feel steadier during the day.',
      sleep: 'Reducing late screen use gives you one clear behaviour to test against sleep timing, recovery, and next-day steadiness.',
      fitness: 'More consistent sleep may improve how prepared you feel for training and recovery.',
    },
    tryText: 'Stop phone use 30 minutes before bed for seven days.',
    experiment: {
      title: 'Finish phone use 30 minutes before bed',
      description: 'A small, trackable test based on the late screen-use pattern Leap found in Maya’s sample data.',
      plan: [
        'Finish phone use by 10:45 p.m. each night.',
        'Add a 10-second morning energy check-in.',
        'Leap compares the seven days with the recent sample baseline.',
      ],
      evaluate: [
        { label: 'Bedtime', icon: Clock3 },
        { label: 'Sleep duration', icon: Moon },
        { label: 'Consistency', icon: RefreshCcw },
        { label: 'Morning energy', icon: Zap },
      ],
      baseline: { label: 'RECENT SAMPLE BASELINE', value: '5h 48m', detail: 'Last night’s sleep' },
      target: { label: 'EXPERIMENT TARGET', value: '10:45', detail: 'Phone away' },
      activeTitle: 'Evening screen-time experiment',
      activeDescription: 'Finish phone use 30 minutes before bed and see what changes.',
      tonightTarget: 'Finish screen use by 10:45 p.m.',
      reminderTime: '10:15 p.m.',
      reminderToast: 'Demo reminder added for 10:15 p.m.',
    },
    dataPoints: [
      { date: 'Mon', signal: 'Phone until 11:43', outcome: '6h 02m sleep' },
      { date: 'Tue', signal: 'Phone until 11:51', outcome: '5h 54m sleep' },
      { date: 'Thu', signal: 'Phone until 10:34', outcome: '6h 57m sleep' },
      { date: 'Fri', signal: 'Phone until 11:56', outcome: '5h 48m sleep' },
    ],
  },
  {
    id: 'food-workout',
    title: 'Your hardest workouts often follow lower-food days',
    summary: 'Three of the four workouts you described as unusually difficult occurred after days when estimated food intake was below your recent average.',
    tags: ['Fitness', 'Nutrition', 'Check-ins'],
    confidence: 'Moderate confidence',
    icon: Dumbbell,
    noticed: 'Workout difficulty ratings were higher after lower-intake days, especially when the first meal was also late.',
    matters: {
      energy: 'More consistent fueling may help you avoid the energy drop that follows a demanding workout.',
      sleep: 'Adequate and consistent fueling can be considered alongside sleep and training load when looking at overall health patterns.',
      fitness: 'This may help you plan food around training quality rather than automatically pushing harder or eating less.',
    },
    tryText: 'Eat a consistent pre-workout meal before your next three sessions.',
    experiment: {
      title: 'Eat a consistent pre-workout meal',
      description: 'A small, trackable test based on the fueling and workout-difficulty pattern Leap found in Maya’s sample data.',
      plan: [
        'Eat a balanced meal 2 to 3 hours before your next three workouts.',
        'Log workout difficulty within 30 minutes after each session.',
        'Leap compares workout feel with recent lower-food and usual-food days.',
      ],
      evaluate: [
        { label: 'Pre-workout fuel', icon: UtensilsCrossed },
        { label: 'Workout difficulty', icon: Dumbbell },
        { label: 'Energy after training', icon: Zap },
        { label: 'Consistency', icon: RefreshCcw },
      ],
      baseline: { label: 'RECENT SAMPLE BASELINE', value: '3 of 4', detail: 'Hard workouts after lower-food days' },
      target: { label: 'EXPERIMENT TARGET', value: '3 meals', detail: 'Before training' },
      activeTitle: 'Pre-workout fueling experiment',
      activeDescription: 'Eat a consistent pre-workout meal and compare how training feels.',
      tonightTarget: 'Log your next planned pre-workout meal.',
      reminderTime: '9:30 a.m.',
      reminderToast: 'Demo reminder added for 9:30 a.m.',
    },
    dataPoints: [
      { date: 'Jun 11', signal: 'Lower intake', outcome: 'Workout: very hard' },
      { date: 'Jun 14', signal: 'Usual intake', outcome: 'Workout: normal' },
      { date: 'Jun 18', signal: 'Lower intake', outcome: 'Workout: very hard' },
      { date: 'Jun 22', signal: 'Lower intake', outcome: 'Workout: harder' },
    ],
  },
  {
    id: 'movement-energy',
    title: 'Morning movement appears connected to better energy',
    summary: 'You reported higher afternoon energy on six of the eight days when you walked before noon.',
    tags: ['Movement', 'Energy'],
    confidence: 'Moderate confidence',
    icon: Footprints,
    noticed: 'Earlier walks overlapped with better afternoon energy ratings more often than later or no walks.',
    matters: {
      energy: 'This is a low-effort behaviour with a visible connection to the outcome you care about most.',
      sleep: 'Earlier movement may support a steadier daily rhythm without adding late-day strain.',
      fitness: 'Morning walks can add consistent low-intensity movement while preserving recovery for training.',
    },
    tryText: 'Take a 15-minute walk before noon on five of the next seven days.',
    experiment: {
      title: 'Take a 15-minute walk before noon',
      description: 'A small, trackable test based on the morning movement and energy pattern Leap found in Maya’s sample data.',
      plan: [
        'Walk for 15 minutes before noon on five of the next seven days.',
        'Add a quick afternoon energy rating each day.',
        'Leap compares walk days with your recent no-walk baseline.',
      ],
      evaluate: [
        { label: 'Morning walk', icon: Footprints },
        { label: 'Afternoon energy', icon: Zap },
        { label: 'Recovery fit', icon: HeartPulse },
        { label: 'Consistency', icon: RefreshCcw },
      ],
      baseline: { label: 'RECENT SAMPLE BASELINE', value: '5 / 10', detail: 'Energy after no morning walk' },
      target: { label: 'EXPERIMENT TARGET', value: '5 days', detail: 'Walk before noon' },
      activeTitle: 'Morning movement experiment',
      activeDescription: 'Take a 15-minute walk before noon and see how afternoon energy changes.',
      tonightTarget: 'Take a 15-minute walk before noon tomorrow.',
      reminderTime: '9:00 a.m.',
      reminderToast: 'Demo reminder added for 9:00 a.m.',
    },
    dataPoints: [
      { date: 'Mon', signal: 'Walk at 9:12', outcome: 'Energy: 8/10' },
      { date: 'Tue', signal: 'No morning walk', outcome: 'Energy: 5/10' },
      { date: 'Thu', signal: 'Walk at 10:04', outcome: 'Energy: 7/10' },
      { date: 'Sat', signal: 'Walk at 8:47', outcome: 'Energy: 8/10' },
    ],
  },
]

function getInsights(profile: ProfileState) {
  const order = getPersonalizedContent(profile).insightOrder
  return order.map((id) => insightLibrary.find((insight) => insight.id === id)!).filter(Boolean)
}

function InsightCard({ insight, onClick, featured = false }: { insight: Insight; onClick: () => void; featured?: boolean }) {
  const Icon = insight.icon
  return (
    <button className={`insight-card ${featured ? 'featured' : ''}`} onClick={onClick}>
      <div className="insight-card-top">
        <span className="insight-icon"><Icon size={21} /></span>
        <span className="confidence-pill">{insight.confidence}</span>
      </div>
      <h3>{insight.title}</h3>
      <p>{insight.summary}</p>
      <div className="insight-card-bottom"><div className="tag-row">{insight.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><span className="round-arrow"><ArrowRight size={15} /></span></div>
    </button>
  )
}

function InsightsScreen({ profile, openInsight, navigate }: { profile: ProfileState; openInsight: (id: InsightId) => void; navigate: (route: Route) => void }) {
  const insights = getInsights(profile)
  return (
    <main className="app-screen has-nav">
      <ScreenHeader action={<button className="icon-button"><MoreHorizontal size={20} /></button>} />
      <section className="page-title padded">
        <span className="section-kicker">CONNECTED PATTERNS</span>
        <h1>Insights</h1>
        <p>Leap looks across your sample information for patterns worth understanding or testing.</p>
      </section>
      <section className="insights-list padded">
        <div className="goal-context"><Target size={15} /><span>Ranked for your goal: <strong>{goalMeta[profile.primaryGoal].label}</strong></span></div>
        {insights.map((insight, index) => (
          <div key={insight.id} className="ranked-insight">
            {index === 0 && <span className="top-match"><Sparkles size={13} /> Best match for your goal</span>}
            <InsightCard insight={insight} onClick={() => openInsight(insight.id)} />
          </div>
        ))}
      </section>
      <section className="insight-method padded">
        <ShieldCheck size={20} />
        <div><strong>Patterns, not diagnoses</strong><p>Leap shows the information used, communicates uncertainty, and suggests small experiments rather than making medical claims.</p></div>
      </section>
    </main>
  )
}

function InsightDetail({ profile, insightId, navigate }: { profile: ProfileState; insightId: InsightId; navigate: (route: Route) => void }) {
  const insight = insightLibrary.find((item) => item.id === insightId) ?? insightLibrary[0]
  const Icon = insight.icon
  return (
    <main className="detail-screen insight-detail-screen">
      <ScreenHeader title="Insight" back={() => navigate('insights')} />
      <div className="insight-detail-hero padded">
        <div className="insight-large-icon"><Icon size={27} /></div>
        <div className="tag-row">{insight.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h1>{insight.title}</h1>
        <span className="confidence-pill"><LineChart size={13} /> {insight.confidence}</span>
      </div>
      <div className="detail-content padded">
        <section className="explain-section">
          <span className="section-kicker">WHAT LEAP NOTICED</span>
          <p className="large-body">{insight.noticed}</p>
        </section>
        <section className="mini-timeline">
          <div className="timeline-head"><span>Sample signal</span><span>What followed</span></div>
          {insight.dataPoints.map((point) => (
            <div className="timeline-row" key={point.date}><strong>{point.date}</strong><span>{point.signal}</span><span>{point.outcome}</span></div>
          ))}
        </section>
        <section className="explain-section">
          <span className="section-kicker">WHY IT MAY MATTER FOR YOU</span>
          <p className="large-body">{insight.matters[profile.primaryGoal]}</p>
          <div className="goal-link"><Target size={15} /> Connected to your primary goal: {goalMeta[profile.primaryGoal].label}</div>
        </section>
        <section className="confidence-explainer">
          <div className="confidence-header"><LineChart size={19} /><strong>Moderate confidence</strong></div>
          <div className="confidence-meter"><span /><span /><span className="muted" /></div>
          <p>The pattern repeats several times, but other factors may also explain the result. A small experiment could make it more useful.</p>
        </section>
        <section className="try-card">
          <span className="section-kicker">WHAT YOU COULD TRY</span>
          <h2>{insight.tryText}</h2>
          <p>Leap will compare what happens with your recent sample baseline.</p>
        </section>
      </div>
      <div className="sticky-action detail-sticky">
        <button className="primary-button" onClick={() => navigate('experiment-setup')}>
          Try this for 7 days <ArrowRight size={18} />
        </button>
      </div>
    </main>
  )
}

function ExperimentSetup({
  profile,
  insightId,
  navigate,
  startExperiment,
}: {
  profile: ProfileState
  insightId: InsightId
  navigate: (route: Route) => void
  startExperiment: () => void
}) {
  const insight = insightLibrary.find((item) => item.id === insightId) ?? insightLibrary[0]
  const experiment = insight.experiment
  const Icon = insight.icon
  return (
    <main className="detail-screen experiment-setup-screen">
      <ScreenHeader title="New experiment" back={() => navigate('insight')} />
      <div className="experiment-hero padded">
        <div className="experiment-icon"><Icon size={29} /></div>
        <span className="section-kicker">7-DAY EXPERIMENT</span>
        <h1>{experiment.title}</h1>
        <p>{experiment.description}</p>
      </div>
      <div className="detail-content padded">
        <section className="experiment-plan">
          <h2>Your plan</h2>
          {experiment.plan.map((step, index) => (
            <div className="plan-row" key={step}><span>{index + 1}</span><p>{step}</p></div>
          ))}
        </section>
        <section className="evaluate-card">
          <span className="section-kicker">LEAP WILL EVALUATE</span>
          <div className="evaluate-grid">
            {experiment.evaluate.map((item) => {
              const EvaluateIcon = item.icon
              return <span key={item.label}><EvaluateIcon size={17} /> {item.label}</span>
            })}
          </div>
        </section>
        <section className="baseline-card">
          <div><small>{experiment.baseline.label}</small><strong>{experiment.baseline.value}</strong><span>{experiment.baseline.detail}</span></div>
          <div><small>{experiment.target.label}</small><strong>{experiment.target.value}</strong><span>{experiment.target.detail}</span></div>
        </section>
        <div className="association-note"><Info size={18} /><p>Leap will look for changes and associations. It will not assume this experiment caused the result.</p></div>
        <div className="goal-link"><Target size={15} /> This experiment supports your goal {goalMeta[profile.primaryGoal].label.toLowerCase()}.</div>
      </div>
      <div className="sticky-action detail-sticky">
        <button className="primary-button" onClick={startExperiment}>Start experiment <ArrowRight size={18} /></button>
      </div>
    </main>
  )
}

function ExperimentsScreen({
  started,
  insightId,
  navigate,
  showToast,
}: {
  started: boolean
  insightId: InsightId
  navigate: (route: Route) => void
  showToast: (message: string) => void
}) {
  const [reminder, setReminder] = useState(false)
  const insight = insightLibrary.find((item) => item.id === insightId) ?? insightLibrary[0]
  const experiment = insight.experiment
  const Icon = insight.icon
  if (!started) {
    return (
      <main className="app-screen has-nav">
        <ScreenHeader />
        <section className="empty-state padded">
          <div className="empty-icon"><TimerReset size={30} /></div>
          <h1>No active experiments</h1>
          <p>Open an insight and turn a pattern into a small, trackable test.</p>
          <button className="primary-button" onClick={() => navigate('insights')}>Explore insights <ArrowRight size={18} /></button>
        </section>
      </main>
    )
  }
  return (
    <main className="app-screen has-nav experiments-screen">
      <ScreenHeader action={<button className="icon-button"><MoreHorizontal size={20} /></button>} />
      <section className="page-title padded">
        <span className="section-kicker">LEARN WHAT WORKS FOR YOU</span>
        <h1>Experiments</h1>
        <p>One active experiment using fictional sample information.</p>
      </section>
      <section className="padded">
        <article className="active-experiment-card">
          <div className="active-experiment-top"><span className="live-pill"><span /> ACTIVE</span><span>Day 1 of 7</span></div>
          <div className="experiment-card-icon"><Icon size={23} /></div>
          <h2>{experiment.activeTitle}</h2>
          <p>{experiment.activeDescription}</p>
          <div className="progress-track"><span style={{ width: '14%' }} /></div>
          <div className="tonight-target"><div><small>TODAY'S TARGET</small><strong>{experiment.tonightTarget}</strong></div><TimerReset size={23} /></div>
          <button
            className={`secondary-button ${reminder ? 'selected' : ''}`}
            onClick={() => {
              setReminder(!reminder)
              showToast(reminder ? 'Reminder removed' : experiment.reminderToast)
            }}
          >
            {reminder ? <BellRing size={17} /> : <Bell size={17} />}
            {reminder ? `Reminder set for ${experiment.reminderTime}` : `Remind me at ${experiment.reminderTime}`}
          </button>
        </article>
      </section>
      <section className="section padded">
        <div className="section-heading"><div><span className="section-kicker">AFTER SEVEN DAYS</span><h2>What Leap will show</h2></div></div>
        <div className="result-preview">
          <div><Check size={16} /><span>Whether you followed the experiment</span></div>
          <div><LineChart size={16} /><span>What changed and what did not</span></div>
          <div><CircleHelp size={16} /><span>How confident Leap is</span></div>
          <div><ArrowRight size={16} /><span>Whether it may be worth continuing</span></div>
        </div>
      </section>
    </main>
  )
}

function BottomNav({ route, navigate }: { route: Route; navigate: (route: Route) => void }) {
  return (
    <nav className="bottom-nav">
      <button className={route === 'today' ? 'active' : ''} onClick={() => navigate('today')}><Home size={20} /><span>Today</span></button>
      <button className={route === 'insights' ? 'active' : ''} onClick={() => navigate('insights')}><Sparkles size={20} /><span>Insights</span></button>
      <button className={route === 'experiments' ? 'active' : ''} onClick={() => navigate('experiments')}><TimerReset size={20} /><span>Experiments</span></button>
    </nav>
  )
}

export default App
