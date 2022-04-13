import { createStyles, Text, Container } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  footer: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
}));

export default function FooterLinks() {
  const { classes } = useStyles();
  return (
    <footer className={ classes.footer }>
      <Container >
        <Text align='center' color="dimmed" size="sm">
          © 2021 All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}