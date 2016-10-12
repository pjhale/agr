import React, { Component } from 'react';

import style from './style.css';
import { makeFieldDisplayName } from '../../lib/searchHelpers';
import CategoryLabel from './categoryLabel';

const DEFAULT_FIELDS = ['symbol', 'name', 'synonym', 'sourceHref', 'geneId', 'species', 'type'];

class ResultsList extends Component {
  renderHighlightedValues(highlight) {
    let displayedVals = Object.keys(highlight).filter( d => {
      return (DEFAULT_FIELDS.indexOf(d) < 0);
    });

    let nodes = displayedVals.map( d => {
      return (
        <div key={`srHigh.${d}`}>
          <dt>{makeFieldDisplayName(d)}:</dt>
          <dd dangerouslySetInnerHTML={{ __html: highlight[d] }} />
        </div>
      );
    });
    return (
      <div>
        {nodes}
      </div>
    );
  }

  renderDiseaseEntry(d, i) {
    // let fields = ['disease_name', 'synonyms', 'OMIM_ID', 'associated_genes'];
    return <div>{d}{i}</div>;
  }

  renderGeneEntry(d, i) {
    return (
      <div className={style.resultContainer} key={`sr${i}`}>
        <div>
          <span className={style.resultCatLabel}>Category: <CategoryLabel category={d.category} /></span>
          <h4>
            <a dangerouslySetInnerHTML={{ __html: d.symbol }} href='#' />
          </h4>
        </div>
        <dl className={style.detailList}>
          <dt>Name:</dt>
          <dd dangerouslySetInnerHTML={{ __html: d.name }} />
          <dt>Synonym:</dt>
          <dd dangerouslySetInnerHTML={{ __html: d.synonym }} />
          <dt>Source:</dt>
          <dd><a dangerouslySetInnerHTML={{ __html: d.geneId }} href={d.sourceHref} target='_new' /></dd>
          <dt>Species:</dt>
          <dd><i dangerouslySetInnerHTML={{ __html: d.species }} /></dd>
          <dt>Gene Type:</dt>
          <dd dangerouslySetInnerHTML={{ __html: d.geneType }} />
          {this.renderHighlightedValues(d.highlight)}
        </dl>
        <hr />
      </div>
    );
  }

  renderGoEntry(d, i) {
    // let fields = ['go_name', 'synonyms', 'OMIM_ID', 'associated_genes'];
    return <div>{d}{i}</div>;
  }

  renderOrthologGroupEntry(d, i) {
    // let fields = ['group_name', 'associated_genes'];
    return <div>{d}{i}</div>;
  }

  renderRows() {
    return this.props.entries.map( (d, i) => {
      switch(d.category) {
      case 'ortholog group':
        return this.renderOrthologGroupEntry(d, i);
      case 'disease':
        return this.renderDiseaseEntry(d, i);
      case 'gene':
        return this.renderGeneEntry(d, i);
      case 'go':
        return this.renderGoEntry(d, i);
      default:
        return this.renderGeneEntry(d, i);
      }
    });
  }

  render() {
    return (
      <div>
        {this.renderRows()}
      </div>
    );
  }
}

ResultsList.propTypes = {
  entries: React.PropTypes.array
};

export default ResultsList;
