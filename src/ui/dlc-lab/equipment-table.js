import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Table,
} from 'react-bootstrap'
import { enumFromTo } from 'subtender'

import { PTyp } from '../../ptyp'
import { dlcLabUISelector, translateSelector } from '../../selectors'
import { dlcList } from '../../master-data'
import { EquipmentTableRow } from './equipment-table-row'

class EquipmentTableImpl extends Component {
  static propTypes = {
    style: PTyp.object,
    equipments: PTyp.object.isRequired,
    tr: PTyp.func.isRequired,
  }

  static defaultProps = {
    style: {},
  }

  render() {
    const {equipments, style, tr} = this.props
    return (
      <Table
        style={{
          ...style,
          tableLayout: 'fixed',
        }}
        bordered condensed>
        <thead>
          <tr>
            <th>
              {tr('DlcLab.DlcTable.Name')}
            </th>
            <th style={{width: '32%'}}>
              {tr('DlcLab.DlcTable.Level')}
            </th>
            <th style={{width: '32%'}}>
              {tr('DlcLab.DlcTable.Count')}
            </th>
          </tr>
        </thead>
        <tbody>
          {
            _.flatMap(
              dlcList,
              ({name,id}) => {
                const equipment = equipments[id]
                if (typeof equipment === 'undefined')
                  return []
                const partialRows = _.flatMap(
                  enumFromTo(0,10).reverse(),
                  level => {
                    const count = equipment[level]
                    if (! _.isInteger(count))
                      return []
                    const key = `${id}-${level}`
                    return [rowSpan => (
                      <EquipmentTableRow
                        key={key}
                        name={name} id={id} level={level} count={count}
                        rowSpan={rowSpan}
                      />
                    )]
                  })
                return partialRows.map((f,ind) =>
                  f(ind === 0 ? partialRows.length : null))
              })
          }
        </tbody>
      </Table>
    )
  }
}

const EquipmentTable = connect(
  state => {
    const {equipments} = dlcLabUISelector(state)
    const {tr} = translateSelector(state)
    return {equipments,tr}
  },
)(EquipmentTableImpl)

export { EquipmentTable }
