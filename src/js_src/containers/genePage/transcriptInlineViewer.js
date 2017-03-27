import React, {Component} from 'react';

import style from './style.css';
// import axios from 'axios';
// import jquery from 'jquery';


var removeImageBlanks = function(imageObject) {
  let imgWidth = imageObject.width;
  let imgHeight = imageObject.height;
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', imgWidth);
  canvas.setAttribute('height', imgHeight);
  var context = canvas.getContext('2d');
  context.drawImage(imageObject, 0, 0);

  var imageData = context.getImageData(0, 0, imgWidth, imgHeight),
    data = imageData.data,
    getRBG = function (x, y) {
      var offset = imgWidth * y + x;
      return {
        red: data[offset * 4],
        green: data[offset * 4 + 1],
        blue: data[offset * 4 + 2],
        opacity: data[offset * 4 + 3]
      };
    },
    isWhite = function (rgb) {
      // many images contain noise, as the white is not a pure #fff white
      return rgb.red > 200 && rgb.green > 200 && rgb.blue > 200;
    },
    scanY = function (fromTop) {
      var offset = fromTop ? 1 : -1;

      // loop through each row
      for (var y = fromTop ? 0 : imgHeight - 1; fromTop ? (y < imgHeight) : (y > -1); y += offset) {

        // loop through each column
        for (var x = 0; x < imgWidth; x++) {
          var rgb = getRBG(x, y);
          if (!isWhite(rgb)) {
            return y;
          }
        }
      }
      return null; // all image is white
    },
    scanX = function (fromLeft) {
      var offset = fromLeft ? 1 : -1;

      // loop through each column
      for (var x = fromLeft ? 0 : imgWidth - 1; fromLeft ? (x < imgWidth) : (x > -1); x += offset) {

        // loop through each row
        for (var y = 0; y < imgHeight; y++) {
          var rgb = getRBG(x, y);
          if (!isWhite(rgb)) {
            return x;
          }
        }
      }
      return null; // all image is white
    };

  var cropTop = scanY(true),
    cropBottom = scanY(false),
    cropLeft = scanX(true),
    cropRight = scanX(false),
    cropWidth = cropRight - cropLeft + 10,
    cropHeight = cropBottom - cropTop + 10;

  canvas.setAttribute('width', cropWidth);
  canvas.setAttribute('height', cropHeight);
  // finally crop the guy
  canvas.getContext('2d').drawImage(imageObject,
    cropLeft, cropTop, cropWidth, cropHeight,
    0, 0, cropWidth, cropHeight);

  return canvas.toDataURL();
}

class TranscriptViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {imageStatus: 'loading'};
  }

  handleImageErrored() {
    this.setState({imageStatus: 'Error loading transcript preview.'});
  }

  handleImageLoaded() {
    this.setState({imageStatus: ''});
  }


  getImage(vizUrl) {
    let myImage = new Image();
    myImage.crossOrigin = 'anonymous';
    myImage['Access-Control-Allow-Origin'] = '*';
    myImage.onload = function () {
      return removeImageBlanks(myImage); //Will return cropped image data
    };
    myImage.src = vizUrl;
  }

  render() {
    // let externalPrefix = 'http://bw.scottcain.net/jbrowse/?data=data%2F';
    let externalPrefix = 'http://34.208.22.23/jbrowse/overview.html?data=data%2F';
    let internalPrefix = 'http://localhost/jbrowse/overview.html?data=data%2F';
    let visualizationPrefix = 'http://dev.alliancegenome.org:8891/?url=';
    let delay = 5000;
    let visualizationSuffix = '&format=PNG&delay=' + delay + '&width=800&height=1000&zoom=1&quality=0.7&cors=true';
    // location based data
    // let locationString = this.props.fmin && this.props.fmax ? this.props.chromosome + ':' + this.props.fmin + '..' + this.props.fmax : this.props.geneSymbol;
    let fmin = this.props.fmin ? this.props.fmin : 10000;
    let fmax = this.props.fmax ? this.props.fmax : 20000;
    let locationString = this.props.chromosome + ':' + fmin + '..' + fmax;
    let uniqueLocation = encodeURI(this.props.species) + '&loc=' + encodeURI(locationString);

    let geneSymbolUrl = '&lookupSymbol=' + this.props.geneSymbol;
    let internalJbrowseUrl = internalPrefix + uniqueLocation + '&tracks=All%20Genes&highlight=' + geneSymbolUrl;
    let externalJbrowseUrl = externalPrefix + uniqueLocation + '&tracks=All%20Genes&highlight=' + geneSymbolUrl;

    // TODO: move EVERYTHING to the externalJBrowseUrl
    // let finalUrl = visualizationUrl + encodeURIComponent(externalJbrowseUrl.replace('DNA%2C', '')) + pngSuffix;
    // let finalUrl = visualizationUrl + encodeURIComponent(internalJbrowseUrl.replace('DNA%2C', '')) ;
    // let visualizationUrl = visualizationPrefix.replace('@IMAGEID@', 'snapshots/' + encodeURI(this.props.species) +'/' + encodeURI(locationString)+ '.jpeg') + uniqueLocation + '&tracks=All%20Genes&highlight=';
    let visualizationUrl = visualizationPrefix + encodeURIComponent(externalJbrowseUrl) + visualizationSuffix;
    // let virualizationUrl2 = 'https://phantomjscloud.com/api/browser/v2/a-demo-key-with-low-quota-per-ip-address/?request={url:'+encodeURI('\"'+externalJbrowseUrl+'\"')+',renderType:"jpg"}';

    return (
      <div className={style.jbrowse}>
        {/*{alert(visualizationUrl)}*/}
        {/*<a href={externalJbrowseUrl.replace('overview.html','index.html')}>Genome Viewer<i className="fa fa-link"></i> </a>*/}
        {/*<a href={externalJbrowseUrl}>Overview<i className="fa fa-link"></i> </a>*/}
        {/*<iframe id="genomeFrame" className={style.jbrowse} src={internalJbrowseUrl}/>*/}
        <a href={externalJbrowseUrl} rel="noopener noreferrer" target='_blank'>
          <img
            onError={this.handleImageErrored.bind(this)}
            onLoad={this.handleImageLoaded.bind(this)}
            src={this.getImage(visualizationUrl)}
          />
        </a>
        {this.state.imageStatus === 'loading'
          ? <div>Loading ... <img src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif"/></div>
          : ''
        }
      </div>
    );
  }


}

TranscriptViewer.propTypes = {
  chromosome: React.PropTypes.string,
  fmax: React.PropTypes.number,
  fmin: React.PropTypes.number,
  geneSymbol: React.PropTypes.string.isRequired,
  species: React.PropTypes.string.isRequired,
};

export default TranscriptViewer;

