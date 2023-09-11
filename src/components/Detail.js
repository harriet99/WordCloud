import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function Detail() {
  const { textID } = useParams();
  
  return (
    <Card>
      <CardContent>
        {textID}
      </CardContent>
    </Card>
  );
}

export default Detail;
