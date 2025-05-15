import { createPolymorphicComponent } from '@mantine/core';
import { Link as RouterLink, LinkProps as LinkPropsRouter } from 'react-router';

import { LinkVariants } from '../../../theme';

import { withDefaultProps, withForwardRef } from '../../shared-utils';
import Anchor, { AnchorProps } from './anchor';

export type LinkProps = Omit<AnchorProps, 'variant'> &
  LinkPropsRouter & {
    variant: LinkVariants | 'link-unstyled';
  };

const Link = (props: LinkProps) => {
  const { prefetch, replace, _ref, children, variant, to, ...mantineLinkProps } = props;

  const nextLinkProps = {
    prefetch,
    scroll,
    replace,
    passHref: true,
    to,
  };

  if (variant === 'link-unstyled') {
    return <RouterLink {...nextLinkProps}>{children}</RouterLink>;
  }

  return (
    <RouterLink {...nextLinkProps}>
      <Anchor href={to} ref={_ref} variant={variant} {...mantineLinkProps}>
        {children}
      </Anchor>
    </RouterLink>
  );
};

const L1 = withDefaultProps<LinkProps>(Link);
const L2 = withForwardRef<Parameters<typeof L1>[0]>(L1);

export default createPolymorphicComponent<'a', Parameters<typeof L2>[0]>(L2);
