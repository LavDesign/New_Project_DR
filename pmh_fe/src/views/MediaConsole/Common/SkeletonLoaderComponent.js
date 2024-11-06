import { Col, Placeholder } from 'react-bootstrap';

const SkeletonLoaderComponent = ({ count = 5 }) => {
  return (
    <div className='d-flex flex-wrap gap-2 p-2'>
      {Array.from({ length: count }).map((_, index) => {
        return (
          <Col xs={12} key={index}>
            <Placeholder animation='glow'>
              <Placeholder xs={12} style={{
                height: '1.5rem',
                borderRadius: '0.5rem',
                opacity: '0.1',
              }} />
            </Placeholder>
          </Col>
        );
      })}
    </div>
  );
};

export default SkeletonLoaderComponent;
