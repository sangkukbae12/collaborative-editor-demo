import {
  Button, Container,
  Paper, PasswordInput, Text, TextInput, Title
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Check } from 'tabler-icons-react';
import { z } from 'zod';

import { userState } from '../../store/atom';
import { authenticate, sha256 } from '../../utils/crypto';


const schema = z.object({
  email: z.string().email({ message: '유효한 이메일이 아닙니다' }),
  password: z.string().min(6, '패스워드는 최소 6자 이상입니다')
});

export default function SignIn() {
  const [user, setUser] = useRecoilState(userState);
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: user
  });
  const navigation = useNavigate();
  const location: any = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <Container size={ 420 } my={ 40 }>
      <Title align="center" >
        Welcome👋
      </Title>
      <Paper withBorder shadow="md" p={ 30 } mt={ 30 } radius="md">
        <form onSubmit={ form.onSubmit(async ({ email, password }) => {
          let hashed = await sha256(password);
          const result = authenticate({ email, password: hashed });

          if (!result) {
            form.setErrors({ 'failed': <Text size='sm' color='red' mt={ 6 }>로그인에 실패하였습니다</Text> });
            return;
          }

          setUser({ email, password: hashed });

          sessionStorage.setItem('secret', JSON.stringify({ email, password: hashed }));

          showNotification({
            title: 'Successfully login!',
            message: 'Welcome back!',
            icon: <Check />
          });
          navigation(from, { state: { email, password: hashed }, replace: true });
        }) }>
          <TextInput label="Email" placeholder="admin@email.com" required autoComplete='off' { ...form.getInputProps('email') } />
          <PasswordInput label="Password" placeholder="123123" required autoComplete='off' mt="md" { ...form.getInputProps('password') } />
          <Button type='submit' fullWidth mt="xl">
            Sign In
          </Button>
          { form.errors?.failed && form.errors?.failed }
        </form>
      </Paper>
    </Container>
  );
}