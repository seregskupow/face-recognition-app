const n = 6;
const WikiPreloader = () =>
  [...Array(n)].map(() => (
    <div key={Math.random()} className='wiki-preloader' />
  ));

export default WikiPreloader;
