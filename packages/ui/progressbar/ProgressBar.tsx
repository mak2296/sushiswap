import classNames from 'classnames'
import { FC } from 'react'

import { AppearOnMount } from '../animation'

export enum ProgressColor {
  PINK,
  BLUE,
  GRADIENT,
  GREEN,
  GRAY,
}

interface ProgressBarProps {
  progress: number | string
  color: ProgressColor
  className?: string
  showLabel?: boolean
}

export const ProgressBar: FC<ProgressBarProps> = ({ progress, color, showLabel = true, className }) => {
  let fromColor
  let toColor
  if (color === ProgressColor.BLUE) {
    fromColor = 'from-blue'
    toColor = 'to-blue'
  } else if (color === ProgressColor.PINK) {
    fromColor = 'from-pink'
    toColor = 'to-pink'
  } else if (color === ProgressColor.GRADIENT) {
    fromColor = 'from-blue'
    toColor = 'to-pink'
  } else if (color === ProgressColor.GREEN) {
    fromColor = 'from-green'
    toColor = 'to-green'
  } else if (color === ProgressColor.GRAY) {
    fromColor = 'from-gray-600 dark:from-slate-400'
    toColor = 'to-gray-600 dark:to-slate-400'
  }

  return (
    <AppearOnMount>
      <div className="flex items-center gap-2">
        <div
          className={classNames(
            'flex flex-grow h-4 rounded-full bg-gradient-to-r overflow-hidden bg-[rgba(255,255,255,0.12)]',
            className
          )}
        >
          <div
            className={`flex justify-end h-full rounded-r-full bg-gradient-to-r ${fromColor} ${toColor}`}
            style={{ width: `${Number(progress) * 100}%` }}
          />
        </div>
        {showLabel ? `${(Number(progress) * 100).toFixed(1)}%` : ''}
      </div>
    </AppearOnMount>
  )
}

export default ProgressBar
