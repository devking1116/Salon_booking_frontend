import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Table, Button, Form, Input } from 'antd'
import { newZipCode, deleteZipCode } from '../controllers/ZipCodes'
import * as _ from 'lodash'

const FormItem = Form.Item
const createForm = Form.create

class ZipCodes extends Component {

  componentWillMount () {
    this.setState({
      selectedRowKeys: []
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!', errors, values)
        return
      }
      this.props.dispatch(newZipCode(values))
      this.props.form.resetFields()
    })
  }

  onSelectChange (selectedRowKeys) {
    this.setState({ selectedRowKeys })
  }

  removeSelectedRows () {
    const rowsForDel = this.state.selectedRowKeys
    for (const id of rowsForDel) {
      this.props.dispatch(deleteZipCode(id))
    }
    this.setState({selectedRowKeys: []})
  }

  columns () {
    return [
      { title: 'Zip code', dataIndex: 'zip', key: 'zip' },
      { title: 'Comment', dataIndex: 'comment', key: 'comment' }
    ]
  }

  render () {
    const dataSource = _.values(this.props.zipCodes)
    const { getFieldDecorator } = this.props.form
    const defaultProps = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      hasFeedback: true
    }

    const selectedRowKeys = this.state.selectedRowKeys
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    }
    const hasSelected = selectedRowKeys.length > 0

    return (
      <div style={styles.container}>

        <div style={styles.tableContainer}>
          <Table columns={this.columns()}
            dataSource={dataSource}
            className={'table'}
            pagination={{ pageSize: 12, total: dataSource.length }}
            rowKey={record => record.zip}
            rowSelection={rowSelection}
            footer={() =>
              <Button type={'primary'}
                onClick={this.removeSelectedRows.bind(this)}
                disabled={!hasSelected}
              >
                DEL
              </Button>
            }
          />
        </div>

        <div style={styles.formContainer}>
          <Form vertical onSubmit={this.handleSubmit.bind(this)}>

            <FormItem label={'Zip code'} {...defaultProps}>
              {getFieldDecorator('zip', {rules: [ {required: true, message: 'Enter zip code'} ]})(
                <Input placeholder={'Zip code'} />
              )}
            </FormItem>

            <FormItem label={'Comment'} {...defaultProps}>
              {getFieldDecorator('comment', {rules: [ {required: true, message: 'Enter a comment for the zip code'} ]})(
                <Input placeholder={'Comment'} />
              )}
            </FormItem>

            <FormItem wrapperCol={{ span: 3, offset: 6 }}>
              <Button
                type={'primary'}
                htmlType={'submit'}
                style={{width: '130px'}}
              >
                New zip code
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  tableContainer: {
    width: '100%'
  },
  formContainer: {
    width: '30%',
    marginTop: 20
  }
}

ZipCodes.propTypes = {
  zipCodes: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
}

ZipCodes = createForm()(ZipCodes)

const mapStateToProps = (state) => (
  {
    salons: state.salons,
    zipCodes: state.zipCodes
  })

export default connect(
  mapStateToProps
)(ZipCodes)
