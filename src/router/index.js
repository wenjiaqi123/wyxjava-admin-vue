import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Admin from '@/components/admin/Admin'
import RotationChart from '@/components/chart/RotationChart'
import AddChart from '@/components/chart/AddChart'
import Subject from '@/components/course/Subject'
import SubjectDetails from '@/components/course/SubjectDetails'
import AddSubject from '@/components/course/AddSubject'
import CourseList from '@/components/course/CourseList'
import CourseDetails from '@/components/course/CourseDetails'
import AddCourse from '@/components/course/AddCourse'
import Question from '@/components/course/Question'
import Navigation from '@/components/navgation/Navigation'
import HowUse from '@/components/navgation/howUse/HowUse'
import Vip from '@/components/navgation/vip/Vip'
import Teacher from '@/components/navgation/teacher/Teacher'
import Suggestion from '@/components/navgation/suggestion/Suggestion'
import Joke from '@/components/navgation/joke/Joke'
import Interview from '@/components/navgation/interview/Interview'
import Icu from '@/components/navgation/icu/Icu'
import Love from '@/components/navgation/love/Love'
import Offer from '@/components/navgation/offer/Offer'
import Wait from '@/components/navgation/wait/Wait'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/login', name: 'Login', component: Login},
    {path: '/admin', name: 'Admin', component: Admin},
    {path: '/rotationChart', name: 'RotationChart', component: RotationChart},
    {path: '/addChart', name: 'AddChart', component: AddChart},
    {path: '/subject', name: 'Subject', component: Subject},
    {path: '/subjectDetails', name: 'SubjectDetails', component: SubjectDetails},
    {path: '/addSubject', name: 'AddSubject', component: AddSubject},
    {path: '/courseList', name: 'CourseList', component: CourseList},
    {path: '/courseDetails', name: 'CourseDetails', component: CourseDetails},
    {path: '/addCourse', name: 'AddCourse', component: AddCourse},
    {path: '/question', name: 'Question', component: Question},
    {path: '/navigation', name: 'Navigation', component: Navigation},
    {path: '/howUse', name: 'HowUse', component: HowUse},
    {path: '/vip', name: 'Vip', component: Vip},
    {path: '/teacher', name: 'Teacher', component: Teacher},
    {path: '/suggestion', name: 'Suggestion', component: Suggestion},
    {path: '/joke', name: 'Joke', component: Joke},
    {path: '/interview', name: 'Interview', component: Interview},
    {path: '/icu', name: 'Icu', component: Icu},
    {path: '/love', name: 'Love', component: Love},
    {path: '/offer', name: 'Offer', component: Offer},
    {path: '/wait', name: 'Wait', component: Wait}
  ]
})
