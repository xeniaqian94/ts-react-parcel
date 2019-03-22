const gapKey = 'infocard-gap-' + i.toString()
infoCards.push(<Box gap="medium" pad="medium" key={gapKey} />) //This is the gap
const buttonKey = 'infocard-' + i.toString()
// const Background =
// 'https://images.pexels.com/photos/34153/pexels-photo.jpg'
const Background = require('./logo.png')
infoCards.push(
  <Box
    width="auto"
    animation={[
      { type: 'fadeIn', duration: 1000 },
      { type: 'slideLeft', size: 'xlarge', duration: 1000 },
    ]}
  >
    <Carousel>
      <Button key={buttonKey} href="#" hoverIndicator>
        <Box
          pad={{
            horizontal: 'medium',
            vertical: 'small',
          }}
          height="medium"
          background={{ color: '#E03A3E', opacity: 'weak' }}
          round="medium"
        >
          <Text weight="bold">Original text: </Text>
          <Text>{currentContextMapping[i].userInput}</Text>
          <Text weight="bold">Claim text: </Text>
          <Text>{currentContextMapping[i].similarClaim}</Text>
          <Text weight="bold">Context struct: </Text>
          <Text>{currentContextMapping[i].contextStruct}</Text>
        </Box>
      </Button>
      <div>
        <img src={require('./logo.png')} className="img-responsive" />
      </div>
      {/* <Button> */}
      <SimpleCollapsible open={true} />
      {/* </Button> */}

      <Box pad="xlarge" background="accent-1">
        <Attraction size="xlarge" href="#" />
      </Box>
    </Carousel>
  </Box>
)
