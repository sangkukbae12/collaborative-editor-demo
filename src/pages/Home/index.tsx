import { Container, Title } from '@mantine/core';
import { Navigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Editor from '../../components/Editor';
import Live from '../../components/Live';
import { userState } from '../../store/atom';
import { authenticate } from '../../utils/crypto';

export default function Home() {
  const user = useRecoilValue(userState);
  const location = useLocation();

  if (!user.email && !user.password) {
    let secret = sessionStorage.getItem('secret');
    if (secret) {
      if (!authenticate(JSON.parse(secret))) {
        return <Navigate to='/login' state={ { from: location } } replace />;
      }
    } else {
      return <Navigate to='/login' state={ { from: location } } replace />;
    }
  }

  return (
    <>
      <Container>
        <Title mb={ 6 } > 👩🏻‍💻Collaborative Coding🧑‍💻</Title>
        <Live />
        <Editor />
      </Container>
    </>
  );
}