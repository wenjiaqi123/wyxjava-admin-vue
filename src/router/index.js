import Vue from 'vue'
import Router from 'vue-router'
import Admin from '@/components/admin/Admin'
import RotationChart from '@/components/home/RotationChart'
import Course from '@/components/curriculum/Course'
import Question from '@/components/curriculum/Question'
import Navigation from '@/components/navgation/Navigation'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/Admin', name: 'Admin', component: Admin},
    {path: '/rotationChart', name: 'RotationChart', component: RotationChart},
    {path: '/course', name: 'Course', component: Course},
    {path: '/question', name: 'Question', component: Question},
    {path: '/navigation', name: 'Navigation', component: Navigation},
  ]
})
