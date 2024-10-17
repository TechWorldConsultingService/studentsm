import React from 'react'
import { Table } from 'antd';
import MainLayout from '../layout/MainLayout';


const MyStudents = () => {




    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
        },
        {
          title: 'Chinese Score',
          dataIndex: 'chinese',
          sorter: {
            compare: (a, b) => a.chinese - b.chinese,
            multiple: 3,
          },
        },
        {
          title: 'Math Score',
          dataIndex: 'math',
          sorter: {
            compare: (a, b) => a.math - b.math,
            multiple: 2,
          },
        },
        {
          title: 'English Score',
          dataIndex: 'english',
          sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
          },
        },
      ];

      const data = [
        {
          key: '1',
          name: 'John Brown',
          chinese: 98,
          math: 60,
          english: 70,
        },
        {
          key: '2',
          name: 'Jim Green',
          chinese: 98,
          math: 66,
          english: 89,
        },
        {
          key: '3',
          name: 'Joe Black',
          chinese: 98,
          math: 90,
          english: 70,
        },
        {
          key: '4',
          name: 'Jim Red',
          chinese: 88,
          math: 99,
          english: 89,
        },
      ];
      const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      };



  return (
    <MainLayout>
 <div>
        <span>List of the students are :</span>
        <Table columns={columns} dataSource={data} onChange={onChange} />  
          </div>
    </MainLayout>
   
  )
}

export default MyStudents