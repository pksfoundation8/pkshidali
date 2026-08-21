import { Icon, type IconName } from './Icon';

export function IconCircle({ n, size = 'md', tone = 'gold', style }: {
  n: IconName; size?: 'sm' | 'md'; tone?: 'gold' | 'olive'; style?: React.CSSProperties;
}) {
  return (
    <span className={`ring${size === 'sm' ? ' sm' : ''}${tone === 'olive' ? ' olive' : ''}`} style={style}>
      <Icon n={n} s={size === 'sm' ? 19 : 22} />
    </span>
  );
}
