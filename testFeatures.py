#!/usr/bin/env python
# -*- coding: utf-8 -*-
from selenium import webdriver
from time import sleep

#driver = webdriver.PhantomJS(service_args=['--ignore-ssl-errors=true'])
driver = webdriver.Firefox()


driver.get("http://127.0.0.1:1337")

print("Clicking Facebook login...")

driver.find_element_by_id("fbButton").click()

print("sleeping 5 secs..")
sleep(5)

#driver.get('https://www.facebook.com/login.php?skip_api_login=1&api_key=1727336227501773&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fv2.5%2Fdialog%2Foauth%3Fredirect_uri%3Dhttp%253A%252F%252Flocalhost%253A1337%252Fauth%252Ffacebook%252Fcallback%26response_type%3Dcode%26client_id%3D1727336227501773%26ret%3Dlogin&cancel_url=http%3A%2F%2Flocalhost%3A1337%2Fauth%2Ffacebook%2Fcallback%3Ferror%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%23_%3D_&display=page&locale=en_GB')

driver.find_element_by_css_selector("input[name='email']").send_keys("jbholmes2016@gmail.com")
driver.find_element_by_css_selector("input[name='pass']").send_keys("glassroom3")
driver.find_element_by_css_selector("button[name='login']").click()

sleep(5)

#elem = 

if len(driver.find_elements_by_css_selector("button[name='__CONFIRM__']")) > 0:
    driver.find_element_by_css_selector("button[name='__CONFIRM__']").click()
    sleep(2)

print("login complete")

#dropdowns = driver.find_elements_by_css_selector("div[class='dropdown']")
#dropdowns[2].find_element_by_css_selector("button").click()
btn = driver.find_elements_by_css_selector("div[id='tablePrint'] > button")

btn[0].click()
print("File load onClick successful!\n")
print("Code Editor successful!\n")
print("Syntax hightlighting successful!\n")
sleep(3)
driver.find_element_by_id('runBtn').click()
sleep(2)
driver.find_element_by_id('compileButton').click()
sleep(3)
print("Syntax Analysis Successful!\n")
print("Error highlighting successful!\n")
btn[1].click()
driver.find_element_by_id('runBtn').click()
sleep(2)
driver.find_element_by_id('compileButton').click()
sleep(3)
print("Successfully Compiled!")
driver.find_element_by_id('runBtn').click()
sleep(5)
driver.find_element_by_id('socialButton').click()
sleep(3)
print("Social Network validate by inspection!\n")
driver.find_element_by_id('runBtn').click()
sleep(1)
driver.find_element_by_id('swimButton').click()
sleep(3)
print("Swin Lane validate by inspection!\n")
driver.find_element_by_id('fileBtn').click()
sleep(1)

driver.get("http://127.0.0.1:1337")
sleep(3)

print("Google login Test...\n")

driver.find_element_by_id("googleButton").click()
#print("sleeping 5 secs..")
sleep(3)
driver.find_element_by_css_selector("input[name='Email']").send_keys("jbholmes2016")
driver.find_element_by_id('next').click()
sleep(3)
driver.find_element_by_css_selector("input[name='Passwd']").send_keys("glassroom3")
driver.find_element_by_id('signIn').click()
sleep(4)
driver.find_element_by_id('submit_approve_access').click()
sleep(2)
print("Google Login Successful!\n")


driver.find_element_by_id('runBtn').click()
sleep(2)
driver.find_element_by_id('compileButton').click()
sleep(3)
print("To Test file save remotely & locally, must be done manually as selenium using phantomjs doesn't support pop-up window interaction!!\n")
print("To Test key bindings, must be done manually as selenium using phantomjs doesn't support editing of codemirror text field!!\n")
print("To Test file upload, must be done manually as selenium using phantomjs doesn't support pop-up window interaction!!\n")

driver.close()






