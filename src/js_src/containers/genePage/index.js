import React, { Component } from 'react';
import { connect } from 'react-redux';

import fetchData from '../../lib/fetchData';
import { fetchGene, fetchGeneSuccess, fetchGeneFailure } from '../../actions/genes';
import { selectGene } from '../../selectors/geneSelectors';

<<<<<<< HEAD
import Disease from './disease';
=======
import BasicGeneInfo from './basicGeneInfo';
import GenePageHeader from './genePageHeader';
import JBrowse from './jbrowse';
import { OrthologyTable, mockOrthologData } from '../../components/orthology';
import { Disease, mockDiseaseData } from '../../components/disease';
import Subsection from '../../components/subsection';
>>>>>>> development


class GenePage extends Component {
  componentDidMount() {
    this.props.dispatch(fetchGene());
    fetchData(`/api/gene/${this.props.params.geneId}`)
      .then(data => this.props.dispatch(fetchGeneSuccess(data)))
      .catch(error => this.props.dispatch(fetchGeneFailure(error)));
  }

  render() {
    if (this.props.loading) {
      return <span>loading...</span>;
    }

    if (this.props.error) {
      return <div className='alert alert-danger'>{this.props.error}</div>;
    }

    if (!this.props.data) {
      return null;
    }

    return (
      <div className='container'>

        <GenePageHeader symbol={this.props.data.symbol} />

        <Subsection>
          <BasicGeneInfo geneData={this.props.data} />
        </Subsection>

        <Subsection title='JBrowse'>
          <JBrowse geneSymbol={this.props.data.symbol} species={this.props.data.species} />
        </Subsection>

        <Subsection hardcoded title='Orthology'>
          <OrthologyTable data={mockOrthologData} />
        </Subsection>
      
        <Subsection hardcoded title='Disease'>
          <Disease data={mockDiseaseData} />
        </Subsection>

      </div>
    );
  }
}


function mapStateToProps(state) {
  return selectGene(state);
}

export { GenePage as GenePage };
export default connect(mapStateToProps)(GenePage);
