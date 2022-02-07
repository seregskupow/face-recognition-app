import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import { useHttp } from '../hooks/http.hook';
import ActorPageComponent from '../components/ActorPageComponentOld';

const ActorPage = () => {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const actorName = (useParams().id || '').split('_').join(' ');
  const [actorData, setActorData] = useState<any>(null);
  const fetchActor = useCallback(async () => {
    try {
      const fetched = await request(
        '/api/db/getsingleactor',
        'POST',
        { name: actorName },
        {
          Authorization: `Bearer ${token}`
        }
      );
      setActorData(fetched.actor);
    } catch (e) {}
  }, [token, request]);

  useEffect(() => {
    fetchActor();
  }, [fetchActor]);
  if (loading) {
    return <Loader position="fixed" />;
  }

  return (
    <>
      {!loading && actorData && (
        <ActorPageComponent
          knownFor={actorData.knownFor}
          image={actorData.image}
          name={actorData.name}
          birthday={actorData.birthday}
          birthPlace={actorData.birthPlace}
          biography={actorData.biography}
        />
      )}
    </>
  );
};
export default ActorPage;
