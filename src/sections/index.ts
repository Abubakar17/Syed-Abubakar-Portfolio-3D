import type { ComponentType } from 'react'
import type { SectionId } from '../content/cv'
import About from './About'
import Experience from './Experience'
import Projects from './Projects'
import Education from './Education'
import Skills from './Skills'
import Contact from './Contact'

/** Every section accepts an optional sub-anchor (e.g. a case-study id). */
export const sectionComponents: Record<SectionId, ComponentType<{ focus?: string | null }>> = {
  about: About,
  experience: Experience,
  projects: Projects,
  education: Education,
  skills: Skills,
  contact: Contact,
}
