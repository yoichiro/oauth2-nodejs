import test from "ava"
import {Result} from "../result";
import {InvalidClient} from "../../exceptions";

test("Result has a succeeded value", t => {
  const subject = Result.success<string>("value1")

  t.is(subject.value, "value1")
  t.is(subject.isSuccess(), true)
  t.is(subject.isError(), false)
  try {
    subject.error
    t.fail()
  } catch(e) {
    t.pass()
  }
})

test("Result has an error value", t => {
  const error = new InvalidClient("")
  const subject = Result.error<string>(error)

  try {
    subject.value
    t.fail()
  } catch(e) {
    t.pass()
  }
  t.is(subject.isSuccess(), false)
  t.is(subject.isError(), true)
  t.is(subject.error, error)
})

test("Result is converted to other type when the result is error", t => {
  const error = new InvalidClient("")
  const subject = Result.error<string>(error)
  const actual: Result<number> = subject.convertError<number>()

  t.is(actual.error, error)
})

test("Result represents a success without any value", t => {
  const subject = Result.success<void>()

  t.is(subject.isSuccess(), true)
  t.is(subject.isError(), false)
})

test("Result#convertError throws Error when the original is a success result", t => {
  const subject = Result.success<string>()

  try {
    subject.convertError<number>()
    t.fail()
  } catch(e) {
    t.pass()
  }
})
