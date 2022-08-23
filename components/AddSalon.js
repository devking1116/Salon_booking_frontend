'use strict'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AddSalonMap from './AddSalonMap'
import { Form, Input, Button, TimePicker, Select, Table, Icon, Rate } from 'antd'
const { Column, ColumnGroup } = Table
import { newSalon, editSalon } from '../actions/SalonActions'
import moment from 'moment'
import * as _ from 'lodash'

const FormItem = Form.Item
const Option = Select.Option
const createForm = Form.create

class AddSalon extends Component {

  constructor (props) {
    super(props)

    this.state = {
      address: (this.props.salon) ? this.props.salon.address : '',
      lat: (this.props.salon) ? this.props.salon.lat : '-',
      lng: (this.props.salon) ? this.props.salon.lng : '-',
      appr_flag: (this.props.salon) ? this.props.salon.appr_flag: '',
      buttonTitle: 'ADD',
      approveTitle: 'Approve'
    }

    if (this.props.salon) {
      if(this.state.appr_flag)
        this.state.buttonTitle = 'Approve'
      this.state.buttonTitle = 'SAVE'
      this.state.approveTitle = 'APPROVE'
    }
  }

  componentDidMount () {
    if (this.props.salon) {
      const { setFieldsValue, getFieldsValue } = this.props.form
      const s = this.props.salon
      const v = getFieldsValue()
      v.name = s.name
      v.phone = s.phone.toString()
      v.address = s.address
      v.lat = s.lat.toString()
      v.lng = s.lng.toString()
      v.site = s.webSite
      v.email = s.email
      v.contactPerson = s.contactPerson
      v.description = s.description
      v.area = s.area
      v.zip = s.zip
      v.parking = s.parking
      v.serviceTypes = s.serviceTypes
      setFieldsValue(v)
    }
  }

  resetForm () {
    this.props.form.resetFields()
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!', errors, values)
        return
      }
      console.log('Submit!!!')
      // console.log(values);
      const { dispatch } = this.props
      if (this.props.salon && this.state.appr_flag) {
        dispatch(editSalon(this.props.salon.id, values))
      } else {
        dispatch(newSalon(values))
        this.resetForm()
      }
    })
  }

  onMarkerClick (marker) {
    // const { setFieldsValue, getFieldsValue } = this.props.form
    const { setFieldsValue } = this.props.form
    setFieldsValue({address: marker.address})
    setFieldsValue({lat: marker.position.lat.toString()})
    setFieldsValue({lng: marker.position.lng.toString()})
    if (marker.az && marker.az.area) setFieldsValue({area: marker.az.area})
    if (marker.az && marker.az.zipCode) setFieldsValue({zip: marker.az.zipCode})
    // const fieldValues = getFieldsValue()
  //  fieldValues.address = marker.address
  //  fieldValues.lat = marker.position.lat.toString()
  //  fieldValues.lng = marker.position.lng.toString()

  //  setFieldsValue(fieldValues)
  }

  defaultLocation () {
    if (this.props.salon) {
      return this.state
    } else {
      return null
    }
  }

  onChange () {
    console.log('time changed')
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const defaultProps = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
      hasFeedback: true
    }
    const dataSource = _.values(this.props.ratings)

    return (
      <div style={styles.container}>
        <div style={styles.mapContainer}>
          <AddSalonMap
            onSelectMarker={this.onMarkerClick.bind(this)}
            location={this.defaultLocation()}
            googleMapsApiLoaded={this.props.loaders.googleMapsApiLoaded}
          />
          <div style={styles.ratingsTable}>
            <Table
              className={'table'}
              dataSource={this.props.ratings}>
              <Column
                title="Rating"
                dataIndex="visitRating"
                key="visitRating"
              />
              <Column
                title="Appointment Date"
                dataIndex="appointmentDate"
                key="appointmentDate"
              />
              <Column
                title="Stylist"
                dataIndex="stylist"
                key="stylist"
              />
            </Table>
          </div>
        </div>
        <div style={styles.formContainer}>
          <Form vertical onSubmit={this.handleSubmit.bind(this)}>

            <FormItem label={'Name'} {...defaultProps}>
              {getFieldDecorator('name', {rules: [ {required: true, message: 'Enter salon name'} ]})(
                <Input placeholder={'Name'} />
              )}
            </FormItem>

            <FormItem label={'Address'} {...defaultProps}>
              {getFieldDecorator('address', {rules: [ {required: true, message: 'Enter address'} ]})(
                <Input placeholder={'Address'} />
              )}
            </FormItem>

            <FormItem label={'Lat'} {...defaultProps}>
              {getFieldDecorator('lat', {rules: [ {required: true, message: 'Enter latitude'} ]})(
                <Input disabled placeholder={'Lat'} />
              )}
            </FormItem>

            <FormItem label={'Lng'} {...defaultProps}>
              {getFieldDecorator('lng', {rules: [ {required: true, message: 'Enter longitude'} ]})(
                <Input disabled placeholder={'Lng'} />
              )}
            </FormItem>

            <FormItem label={'Area'} {...defaultProps}>
              {getFieldDecorator('area', {rules: [ {required: true, message: 'Enter area'} ]})(
                <Input disabled placeholder={'Area'} />
              )}
            </FormItem>

            <FormItem label={'Zip code'} {...defaultProps}>
              {getFieldDecorator('zip', {rules: [ {required: true, message: 'Enter zip code'} ]})(
                <Input disabled placeholder={'Zip code'} />
              )}
            </FormItem>

            <FormItem label={'Phone'} {...defaultProps}>
              {getFieldDecorator('phone', {rules: [ {required: true, message: 'Enter phone number'} ]})(
                <Input placeholder={'300 300 00 00'} />
              )}
            </FormItem>

            <FormItem label={'Web site url'} {...defaultProps}>
              {getFieldDecorator('site', {rules: [ {required: false, message: 'Enter web site url'} ]})(
                <Input placeholder={'http://your.site.url'} />
              )}
            </FormItem>

            <FormItem label={'Email'} {...defaultProps}>
              {getFieldDecorator('email', {rules: [ {required: false, message: 'Enter email'} ]})(
                <Input placeholder={'admin@your.site.url'} />
              )}
            </FormItem>

            <FormItem label={'Contact person'} {...defaultProps}>
              {getFieldDecorator('contactPerson', {rules: [ {required: false, message: 'Enter contact person name'} ]})(
                <Input placeholder={'Joanna Miller'} />
              )}
            </FormItem>

            <FormItem label={'Description'} {...defaultProps}>
              {getFieldDecorator('description', {rules: [ {required: false, message: 'Enter salon description'} ]})(
                <Input autosize={{ minRows: 3 }} type='textarea' placeholder={'Some info about salon'} />
              )}
            </FormItem>

            <FormItem label={'Parking'} {...defaultProps}>
              {getFieldDecorator('parking', {rules: [ {required: false, message: 'Enter parking description'} ]})(
                <Input autosize={{ minRows: 3 }} type='textarea' placeholder={'Parking'} />
              )}
            </FormItem>

            <FormItem label={'Service(s) Offered'} {...defaultProps}>
              {getFieldDecorator('serviceTypes', {rules: [ {required: false, message: 'What service(s) are offered'} ]})(
                <Select
                  multiple
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  onChange={this.handleChange}
                >
                  <Option key={1}>Blowouts</Option>
                  <Option key={2}>Extensions</Option>
                  <Option key={3}>Coloring</Option>
                </Select>
              )}
            </FormItem>

            <FormItem label={'Hours of operation'} {...defaultProps}>
              {getFieldDecorator('serviceTypes', {rules: [ {required: false, message: 'Hours of operation'} ]})(
                <div style={{display: 'flex', flexDirection: 'row'}} >

                  <TimePicker
                    hideDisabledOptions
                    format={'HH:mm'}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                  />
                  <TimePicker
                    format={'HH:mm'}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                  />
                </div>
              )}
            </FormItem>

            <FormItem wrapperCol={{ span: 12, offset: 7 }}>
              <Button
                type={'primary'}
                htmlType={'submit'}
                style={{width: '130px'}}
                onClick={this.handleSubmit.bind(this)}>
                {this.state.buttonTitle}
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
    flexDirection: 'row',
    justifyContent: 'space-start'
  },
  mapContainer: {
    width: 800,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // padding: 25
  },
  formContainer: {
    width: '80%'
  },
  ratingsTable: {
    width: 800,
    marginTop: 50,
    marginHorizontal: 20
  }
}

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 12 }
}

const formStyle = {
  width: '100%'
}

AddSalon.defaultProps = {
  ratings: [ //TEMPORARY, for UI display purposes only TODO replace this when we have ratings data from redux/firebase implemented
    { id: 1, visitRating: 3.5, appointmentDate: moment().add(3, 'days').format('h:mm A MM/D/YYYY'), stylist: 'Stephanie Thomas'  },
    { id: 2, visitRating: 4.5, appointmentDate: moment().add(7, 'days'), stylist: 'Tiffany Davis'  },
    { id: 3, visitRating: 1.5, appointmentDate: moment().add(2, 'days'), stylist: 'Karen Jones'  },
    {
      key: '4',
      firstName: 'Jim',
      lastName: 'Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    }
  ]
}


AddSalon.propTypes = {
  dispatch: PropTypes.func.isRequired,
  salon: PropTypes.object,
  form: PropTypes.object.isRequired
}

AddSalon = createForm()(AddSalon)

const mapStateToProps = (state) => ({
  loaders: state.loaders
})

export default connect(
  mapStateToProps
)(AddSalon)
