import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Skill } from '../../types';

interface SkillBarProps {
  skill: Skill;
}

const SkillBar = ({ skill }: SkillBarProps) => {
  const [width, setWidth] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      // Animate the width after a small delay
      const timer = setTimeout(() => {
        setWidth(skill.proficiency);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inView, skill.proficiency]);

  return (
    <div ref={ref} className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{skill.name}</span>
        </div>
        <span className="font-mono text-sm font-medium text-primary-600 dark:text-primary-400">
          {width}%
        </span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-progress"
          style={{ 
            width: `${width}%`,
            backgroundColor: skill.color || '#0d96ea'
          }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;